/**
 * GA4 client-side tracking layer.
 *
 * Uses gtag.js loaded via index.html <script> tag.
 * All calls are fire-and-forget so they never block the UI.
 */

declare function gtag(...args: unknown[]): void;

function safeGtag(...args: unknown[]) {
  if (typeof gtag === "function") gtag(...args);
}

/* ── Core ── */

export function trackPageView(path: string, title: string) {
  safeGtag("event", "page_view", {
    page_path: path,
    page_title: title,
  });
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
) {
  safeGtag("event", name, params);
}

export function setUserProps(props: Record<string, string>) {
  safeGtag("set", "user_properties", props);
}

/* ── Convenience wrappers ── */

export function trackCourseApplication(courseName: string) {
  trackEvent("begin_checkout", { programme: courseName });
}

export function trackContactSubmit() {
  trackEvent("generate_lead", { method: "contact_form" });
}

export function trackCTAClick(label: string, page: string) {
  trackEvent("cta_click", { label, page });
}

export function trackOutboundLink(url: string) {
  trackEvent("click", { link_url: url, outbound: true });
}

/* ── Blog events ── */

export function trackBlogView(
  slug: string,
  title: string,
  category: string
) {
  trackEvent("blog_view", { slug, title, category });
}

export function trackBlogShare(slug: string, method: string) {
  trackEvent("blog_share", { slug, method });
}

/* ── Event events ── */

export function trackEventRegistration(eventTitle: string) {
  trackEvent("event_registration", { event_title: eventTitle });
}

export function trackCertificateVerify(certNumber: string) {
  trackEvent("certificate_verify", { cert_number: certNumber });
}
