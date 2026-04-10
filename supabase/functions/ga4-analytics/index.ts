const GA4_PROPERTY_ID = Deno.env.get("GA4_PROPERTY_ID") || "";
const GA4_CLIENT_EMAIL = Deno.env.get("GA4_CLIENT_EMAIL") || "";

const rawKey = Deno.env.get("GA4_PRIVATE_KEY") || "";
const GA4_PRIVATE_KEY = rawKey
  .replace(/\\\\n/g, "\n")
  .replace(/\\n/g, "\n");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── Pure Web Crypto JWT signing ───

function base64url(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function textToBase64url(text: string): string {
  return base64url(new TextEncoder().encode(text));
}

async function createSignedJwt(
  email: string,
  privateKeyPem: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = textToBase64url(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  );
  const payload = textToBase64url(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const signingInput = `${header}.${payload}`;

  const pemBody = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");

  if (!pemBody) {
    throw new Error(
      "Private key is empty after PEM parsing — check GA4_PRIVATE_KEY format"
    );
  }

  const binaryKey = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  return `${signingInput}.${base64url(new Uint8Array(signature))}`;
}

async function getAccessToken(): Promise<string> {
  const jwt = await createSignedJwt(GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Google token error: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

// ─── GA4 Data API helpers ───

interface GA4Row {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

async function runReport(
  token: string,
  body: Record<string, unknown>
): Promise<GA4Row[]> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  if (data.error) {
    throw new Error(
      `GA4 API: ${data.error.message || JSON.stringify(data.error)}`
    );
  }
  return data.rows || [];
}

// ─── Handler ───

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    if (!GA4_PROPERTY_ID || !GA4_CLIENT_EMAIL || !GA4_PRIVATE_KEY) {
      throw new Error(
        `GA4 credentials not configured: PROPERTY_ID=${!!GA4_PROPERTY_ID}, EMAIL=${!!GA4_CLIENT_EMAIL}, KEY=${!!GA4_PRIVATE_KEY}`
      );
    }

    if (!GA4_PRIVATE_KEY.includes("BEGIN PRIVATE KEY")) {
      throw new Error(
        "GA4_PRIVATE_KEY does not contain valid PEM markers — the key may be truncated or incorrectly formatted in Supabase secrets"
      );
    }

    const url = new URL(req.url);
    let days = parseInt(url.searchParams.get("days") || "30", 10);
    try {
      if (req.method === "POST") {
        const body = await req.json();
        if (body?.days) days = parseInt(body.days, 10);
      }
    } catch {
      /* use query param fallback */
    }

    const startDate = `${days}daysAgo`;
    const endDate = "today";
    const prevStart = `${days * 2}daysAgo`;
    const prevEnd = `${days + 1}daysAgo`;

    const token = await getAccessToken();

    // Run all reports in parallel
    const [
      overviewRows,
      prevOverviewRows,
      pageRows,
      dailyRows,
      referrerRows,
      deviceRows,
    ] = await Promise.all([
      runReport(token, {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: "screenPageViews" },
          { name: "sessions" },
          { name: "bounceRate" },
        ],
      }),
      runReport(token, {
        dateRanges: [{ startDate: prevStart, endDate: prevEnd }],
        metrics: [{ name: "screenPageViews" }, { name: "sessions" }],
      }),
      runReport(token, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [
          { metric: { metricName: "screenPageViews" }, desc: true },
        ],
        limit: 20,
      }),
      runReport(token, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport(token, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 10,
      }),
      runReport(token, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }],
      }),
    ]);

    // Parse overview
    const currentViews = parseInt(
      overviewRows[0]?.metricValues?.[0]?.value || "0"
    );
    const currentSessions = parseInt(
      overviewRows[0]?.metricValues?.[1]?.value || "0"
    );
    const bounceRate = parseFloat(
      overviewRows[0]?.metricValues?.[2]?.value || "0"
    );

    const prevViews = parseInt(
      prevOverviewRows[0]?.metricValues?.[0]?.value || "0"
    );
    const prevSessions = parseInt(
      prevOverviewRows[0]?.metricValues?.[1]?.value || "0"
    );

    const viewsTrend =
      prevViews > 0
        ? Math.round(((currentViews - prevViews) / prevViews) * 100)
        : 0;
    const sessionsTrend =
      prevSessions > 0
        ? Math.round(
            ((currentSessions - prevSessions) / prevSessions) * 100
          )
        : 0;

    const topPages = pageRows.map((r) => ({
      path: r.dimensionValues[0].value,
      title: r.dimensionValues[1].value || r.dimensionValues[0].value,
      views: parseInt(r.metricValues[0].value),
    }));

    const dailyViews = dailyRows.map((r) => {
      const raw = r.dimensionValues[0].value; // YYYYMMDD
      return {
        date: `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`,
        count: parseInt(r.metricValues[0].value),
      };
    });

    let directTraffic = 0;
    const topReferrers: { source: string; count: number }[] = [];
    for (const r of referrerRows) {
      const source = r.dimensionValues[0].value;
      const count = parseInt(r.metricValues[0].value);
      if (source === "(direct)") {
        directTraffic = count;
      } else {
        topReferrers.push({ source, count });
      }
    }

    const devices = { desktop: 0, tablet: 0, mobile: 0 };
    for (const r of deviceRows) {
      const cat = r.dimensionValues[0].value.toLowerCase();
      if (cat === "desktop" || cat === "tablet" || cat === "mobile") {
        devices[cat] = parseInt(r.metricValues[0].value);
      }
    }

    const avgPagesPerSession =
      currentSessions > 0
        ? (currentViews / currentSessions).toFixed(1)
        : "0";

    const result = {
      totalViews: currentViews,
      last30Views: currentViews,
      sessions30: currentSessions,
      bounceRate: Math.round(bounceRate * 100) / 100,
      avgPagesPerSession,
      topPages,
      dailyViews,
      topReferrers,
      directTraffic,
      devices,
      viewsTrend,
      sessionsTrend,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GA4 analytics error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
