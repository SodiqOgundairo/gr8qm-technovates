import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const COMPANY_CONTEXT = `You are the AI assistant for Gr8QM Technovates — a design and technology studio based in Lagos, Nigeria.

WHAT WE DO:
1. Design & Build — Websites, mobile apps, enterprise systems. Full-stack: UX research, UI design, frontend/backend development, API integration, deployment, and ongoing support.
2. Print Shop — Premium print: business cards, flyers, banners, posters, branded merch, custom packaging. Fast turnaround.
3. Tech Training — Sponsored cohort programs (only commitment fee required). Tracks: Product Design, Product Management, Frontend Dev, Backend Dev, DevOps, Cybersecurity, QA Testing. Real projects, industry mentors, career support.

CONTACT:
- Email: hello@gr8qm.com
- Phone: +234 901 329 4248
- Website: https://gr8qm.com

PRICING:
- Design & Build: Custom quotes based on project scope. Contact us for a free consultation.
- Print Shop: Varies by product and quantity. Request a quote via our service request form.
- Tech Training: Sponsored programs with a commitment fee (not full tuition). Check /services/tech-training for current cohort info.

KEY PAGES:
- Services: /services
- Design & Build: /services/design-build
- Print Shop: /services/print-shop
- Tech Training: /services/tech-training
- Portfolio: /portfolio
- About: /about
- Contact: /contact
- Blog: /blog
- Careers: /careers

TONE: Friendly, professional, helpful. Be concise. If you don't know something specific (like exact prices or dates), say so and direct them to contact the team. Always offer to connect them with the team for detailed inquiries.

IMPORTANT: You represent Gr8QM. Do not make up information. If asked about something outside your knowledge, politely redirect to contacting the team directly.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  context?: "public" | "blog-assist";
  blogContent?: string;
  action?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const { messages, context, blogContent, action }: ChatRequest =
      await req.json();

    let systemPrompt = COMPANY_CONTEXT;

    // Blog assistant mode
    if (context === "blog-assist") {
      systemPrompt = `You are an AI writing assistant for the Gr8QM Technovates blog editor. Help with blog content creation.

Company context: Gr8QM Technovates is a design and technology studio in Lagos, Nigeria offering Design & Build, Print Shop, and Tech Training services.

Blog tone: Professional yet approachable, insightful, authoritative on design/tech/training topics.`;

      if (action === "suggest-title" && blogContent) {
        systemPrompt +=
          "\n\nThe user wants title suggestions for their blog post. Suggest 5 compelling, SEO-friendly titles. Return them as a numbered list.";
      } else if (action === "improve-grammar" && blogContent) {
        systemPrompt +=
          "\n\nThe user wants grammar and style improvements. Return the corrected text with brief notes on what was changed.";
      } else if (action === "generate-seo" && blogContent) {
        systemPrompt +=
          '\n\nGenerate SEO metadata for this blog post. Return JSON with: {"seo_title": "...", "seo_description": "... (max 160 chars)", "keywords": ["keyword1", "keyword2", ...]}. Make it optimized for search engines.';
      } else if (action === "generate-excerpt" && blogContent) {
        systemPrompt +=
          "\n\nGenerate a compelling excerpt/summary for this blog post (2-3 sentences, max 200 chars). It should entice readers to click and read the full article.";
      }
    }

    const anthropicMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // If blog content is provided as context, prepend it
    if (blogContent && anthropicMessages.length > 0) {
      const lastMsg = anthropicMessages[anthropicMessages.length - 1];
      if (lastMsg.role === "user") {
        lastMsg.content = `[Blog content]:\n${blogContent}\n\n[Request]: ${lastMsg.content}`;
      }
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: systemPrompt,
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const assistantMessage =
      data.content?.[0]?.text || "Sorry, I could not generate a response.";

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred",
        message:
          "I'm having trouble connecting right now. Please contact us directly at hello@gr8qm.com or call +234 901 329 4248.",
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
});
