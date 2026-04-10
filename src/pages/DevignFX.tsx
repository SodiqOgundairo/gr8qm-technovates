import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Container from "../components/layout/Container";
import RevealOnScroll from "../components/animations/RevealOnScroll";
import AnimatedCounter from "../components/animations/AnimatedCounter";
import GlowCard from "../components/animations/GlowCard";
import MagneticButton from "../components/animations/MagneticButton";
import { initializePayment, generateReference, formatAmount } from "../utils/paystack";
import { validateCoupon } from "../lib/coupons";

/* ═══════════════════════════════════════════════════════════
   DEVIGNFX — Automated Forex Trading Bot Landing Page
   Color palette: deep charcoal → emerald greens → amber accents
   Font: Inter (system) for sharp, fintech feel
   ═══════════════════════════════════════════════════════════ */

const TIERS = [
  {
    id: "standard",
    name: "Standard",
    price: 50_000,
    period: "30 days",
    features: [
      "Full automated trading",
      "All available MT5 pairs",
      "Smart news filter",
      "Telegram trade alerts",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 120_000,
    period: "90 days",
    features: [
      "Everything in Standard",
      "All 350+ MT5 instruments",
      "Priority signal execution",
      "Advanced risk management",
      "Dedicated Telegram support",
      "Free updates during license",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 350_000,
    period: "365 days",
    features: [
      "Everything in Premium",
      "Custom pair configuration",
      "Multi-account support",
      "Private strategy tuning",
      "1-on-1 onboarding call",
      "Priority feature requests",
    ],
    popular: false,
  },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Sub-Second Execution",
    desc: "Trades execute within milliseconds of signal confirmation — no manual delay.",
  },
  {
    icon: "🛡️",
    title: "Multi-Layer Confluence",
    desc: "RSI, MACD, Bollinger, EMA crossover, H1 trend — signals require 3+ confluences.",
  },
  {
    icon: "📰",
    title: "Smart News Filter",
    desc: "Automatically pauses trading around high-impact news events from ForexFactory.",
  },
  {
    icon: "📊",
    title: "Dynamic Risk Control",
    desc: "Asset-class SL/TP sizing, spread filters, and per-session cooldowns.",
  },
  {
    icon: "🔐",
    title: "Encrypted & Signed",
    desc: "AES-encrypted source, Ed25519-signed builds, machine-locked license keys.",
  },
  {
    icon: "🤖",
    title: "Fully Autonomous",
    desc: "Set it and forget it. The bot scans, enters, manages, and exits — 24/5.",
  },
];

/* ── Shared animation presets ─────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

function DevignFXPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  /* ── Coupon + checkout state ────────────────────────── */
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<{
    valid: boolean;
    error?: string;
    discountAmount?: number;
    finalAmount?: number;
    tierId?: string;
  } | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutName, setCheckoutName] = useState("");
  const [activeTier, setActiveTier] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const selectedTier = TIERS.find((t) => t.id === activeTier);

  const applyCoupon = async (tierId: string, amount: number) => {
    if (!couponCode.trim()) {
      setCouponResult(null);
      return;
    }
    setValidatingCoupon(true);
    try {
      const result = await validateCoupon(couponCode, amount, "devignfx");
      setCouponResult({
        valid: result.valid,
        error: result.valid ? undefined : result.error,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
        tierId,
      });
    } catch {
      setCouponResult({ valid: false, error: "Could not validate coupon." });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckout = () => {
    if (!selectedTier || !checkoutEmail || !checkoutName) return;

    const finalAmount =
      couponResult?.valid && couponResult.tierId === activeTier
        ? couponResult.finalAmount!
        : selectedTier.price;

    initializePayment({
      email: checkoutEmail,
      amount: finalAmount,
      reference: generateReference("DEVFX"),
      metadata: {
        type: "devignfx",
        tier: selectedTier.id,
        customer_name: checkoutName,
        coupon_code: couponResult?.valid ? couponCode : undefined,
      },
    });
  };

  const getDisplayPrice = (tier: (typeof TIERS)[0]) => {
    if (couponResult?.valid && couponResult.tierId === tier.id) {
      return couponResult.finalAmount!;
    }
    return tier.price;
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white overflow-hidden font-sans">
      {/* ════════ NAV BAR ════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0f0a]/80 border-b border-emerald-500/10">
        <Container>
          <div className="flex items-center justify-between h-16">
            <a href="#top" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-black">
                FX
              </div>
              <span className="text-lg font-bold tracking-tight">
                Devign<span className="text-emerald-400">FX</span>
              </span>
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
              <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
              <a href="#stats" className="hover:text-emerald-400 transition-colors">Performance</a>
              <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
            </div>
            <a
              href="#pricing"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
            >
              Get Started
            </a>
          </div>
        </Container>
      </nav>

      {/* ════════ HERO ════════ */}
      <section ref={heroRef} id="top" className="relative min-h-screen flex items-center pt-16">
        {/* Atmospheric background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-amber-500/[0.05] blur-[100px]" />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Fully Automated Forex Trading
                </div>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.1 }}
              >
                Trade Smarter.
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
                  Sleep Better.
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.2 }}
              >
                DevignFX is an AI-powered MetaTrader 5 bot that scans 350+ MT5 instruments,
                confirms multi-confluence signals across 350+ instruments, and executes trades —
                all while you focus on what matters.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.35 }}
              >
                <MagneticButton strength={20}>
                  <a
                    href="#pricing"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-black font-bold text-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Start Trading
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </MagneticButton>
                <a
                  href="#features"
                  className="px-8 py-4 rounded-xl border border-white/10 text-gray-300 font-medium hover:border-emerald-500/30 hover:text-white transition-all"
                >
                  See How It Works
                </a>
              </motion.div>

              {/* Floating chart mockup */}
              <motion.div
                className="mt-16 mx-auto max-w-2xl rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease, delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  <span className="ml-2 text-xs text-gray-500 font-mono">devignfx_terminal</span>
                </div>
                <div className="font-mono text-xs md:text-sm text-gray-400 space-y-1.5 text-left">
                  <p><span className="text-emerald-400">[SCAN]</span> Scanning 28 pairs across 3 sessions...</p>
                  <p><span className="text-amber-400">[SIGNAL]</span> EURUSD — BUY confluence: RSI_DIV + MACD_CROSS + BB_SQUEEZE + EMA_TREND</p>
                  <p><span className="text-emerald-400">[ENTRY]</span> EURUSD BUY @ 1.08432 | SL: 1.08182 | TP: 1.08932</p>
                  <p><span className="text-gray-500">[NEWS]</span> Pausing GBP pairs — 14:00 BOE Rate Decision</p>
                  <p><span className="text-emerald-400">[CLOSE]</span> EURUSD +50.0 pips | +$127.50 profit</p>
                </div>
              </motion.div>
            </div>
          </Container>
        </motion.div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section id="features" className="py-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <Container>
          <RevealOnScroll direction="up" delay={0}>
            <div className="text-center mb-16">
              <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">
                Built for Serious Traders
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Precision at Every Level
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <RevealOnScroll key={f.title} direction="up" delay={i * 0.08}>
                <GlowCard
                  className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 h-full hover:border-emerald-500/20 transition-colors"
                  glowColor="rgba(16,185,129,0.12)"
                >
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </GlowCard>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════ STATS ════════ */}
      <section id="stats" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] to-transparent" />
        <Container>
          <RevealOnScroll direction="up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { target: 350, suffix: "+", label: "MT5 Instruments" },
                { target: 5, suffix: "", label: "Confluence Layers" },
                { target: 24, suffix: "/5", label: "Hours Active" },
                { target: 99, suffix: "%", label: "Uptime" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">
                    <AnimatedCounter target={s.target} suffix={s.suffix} duration={2} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section className="py-28">
        <Container>
          <RevealOnScroll direction="up">
            <div className="text-center mb-16">
              <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">
                Simple Setup
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Up and Running in Minutes
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Purchase a License",
                desc: "Choose your plan and complete payment. Your license key is delivered instantly to your email.",
              },
              {
                step: "02",
                title: "Install on MT5",
                desc: "Download the bot, place it in your MetaTrader 5 directory, and enter your license key.",
              },
              {
                step: "03",
                title: "Let It Trade",
                desc: "The bot auto-activates, binds to your machine, and starts scanning for high-probability setups.",
              },
            ].map((item, i) => (
              <RevealOnScroll key={item.step} direction="up" delay={i * 0.12}>
                <div className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <span className="text-6xl font-black text-emerald-500/10 absolute top-4 right-6">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold mb-2 relative">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed relative">{item.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════ PRICING ════════ */}
      <section id="pricing" className="py-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <Container>
          <RevealOnScroll direction="up">
            <div className="text-center mb-6">
              <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">
                Pricing
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Choose Your Edge
              </h2>
            </div>
          </RevealOnScroll>

          {/* Coupon input */}
          <RevealOnScroll direction="up" delay={0.1}>
            <div className="max-w-sm mx-auto mb-12">
              <label className="block text-xs text-gray-500 mb-1.5 text-center">Have a coupon code?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponResult(null);
                  }}
                  placeholder="ENTER CODE"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/40"
                />
              </div>
              {couponResult && !couponResult.valid && (
                <p className="text-red-400 text-xs mt-1.5">{couponResult.error}</p>
              )}
              {couponResult?.valid && (
                <p className="text-emerald-400 text-xs mt-1.5">
                  Coupon applied! You save {formatAmount(couponResult.discountAmount!)}.
                </p>
              )}
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TIERS.map((tier, i) => (
              <RevealOnScroll key={tier.id} direction="up" delay={i * 0.1}>
                <GlowCard
                  className={`group relative rounded-2xl p-8 h-full transition-colors ${
                    tier.popular
                      ? "bg-emerald-500/[0.08] border-2 border-emerald-500/30"
                      : "bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/20"
                  }`}
                  glowColor={tier.popular ? "rgba(16,185,129,0.18)" : "rgba(16,185,129,0.1)"}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-bold tracking-wider uppercase">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                  <p className="text-gray-500 text-xs mb-6">{tier.period} license</p>

                  <div className="mb-6">
                    {couponResult?.valid && couponResult.tierId === tier.id && (
                      <span className="text-gray-500 text-sm line-through mr-2">
                        {formatAmount(tier.price)}
                      </span>
                    )}
                    <span className="text-3xl font-black">
                      {formatAmount(getDisplayPrice(tier))}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                        <svg
                          className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <MagneticButton strength={15} className="w-full">
                    <button
                      onClick={() => {
                        setActiveTier(tier.id);
                        setShowCheckout(true);
                        if (couponCode.trim()) {
                          applyCoupon(tier.id, tier.price);
                        }
                      }}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors ${
                        tier.popular
                          ? "bg-emerald-500 text-black hover:bg-emerald-400"
                          : "bg-white/[0.08] text-white hover:bg-white/[0.14]"
                      }`}
                    >
                      Get {tier.name}
                    </button>
                  </MagneticButton>
                </GlowCard>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════ CHECKOUT MODAL ════════ */}
      {showCheckout && selectedTier && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCheckout(false)}
          />
          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-[#111611] border border-emerald-500/20 p-8"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold mb-1">
              Complete Purchase — {selectedTier.name}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {selectedTier.period} license •{" "}
              <span className="text-emerald-400 font-semibold">
                {formatAmount(getDisplayPrice(selectedTier))}
              </span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/40"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              {/* Coupon in modal */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Coupon Code (optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponResult(null);
                    }}
                    placeholder="ENTER CODE"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/40"
                  />
                  <button
                    onClick={() => applyCoupon(selectedTier.id, selectedTier.price)}
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="px-4 py-3 rounded-lg bg-white/[0.08] text-sm font-medium hover:bg-white/[0.14] transition-colors disabled:opacity-40"
                  >
                    {validatingCoupon ? "..." : "Apply"}
                  </button>
                </div>
                {couponResult && !couponResult.valid && (
                  <p className="text-red-400 text-xs mt-1">{couponResult.error}</p>
                )}
                {couponResult?.valid && couponResult.tierId === selectedTier.id && (
                  <p className="text-emerald-400 text-xs mt-1">
                    -{formatAmount(couponResult.discountAmount!)} discount applied
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={!checkoutEmail || !checkoutName}
              className="w-full mt-6 py-4 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Pay {formatAmount(getDisplayPrice(selectedTier))}
            </button>

            <p className="text-[10px] text-gray-600 text-center mt-3">
              Secured by Paystack. Your license key will be emailed instantly after payment.
            </p>
          </motion.div>
        </div>
      )}

      {/* ════════ FAQ ════════ */}
      <section className="py-28">
        <Container>
          <RevealOnScroll direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
          </RevealOnScroll>

          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                q: "What broker do I need?",
                a: "Any MT5-compatible broker works. We recommend brokers with tight spreads on major pairs (IC Markets, Pepperstone, Exness, etc.).",
              },
              {
                q: "Can I run the bot on a VPS?",
                a: "Yes, we recommend running on a VPS for 24/5 uptime. The license binds to the machine it first activates on.",
              },
              {
                q: "What if I need to change machines?",
                a: "Contact us and we'll unbind your license so you can reactivate on a new machine. Enterprise plans include self-service unbinding.",
              },
              {
                q: "Is the bot profitable?",
                a: "Past performance doesn't guarantee future results. The bot uses multi-confluence analysis to identify high-probability setups, but forex trading always carries risk. Never trade money you can't afford to lose.",
              },
              {
                q: "How do I get support?",
                a: "Standard plans get email support. Premium and Enterprise plans include dedicated Telegram support with priority response times.",
              },
            ].map((faq, i) => (
              <RevealOnScroll key={i} direction="up" delay={i * 0.05}>
                <details className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
                  <summary className="cursor-pointer px-6 py-5 text-sm font-semibold flex items-center justify-between hover:text-emerald-400 transition-colors list-none">
                    {faq.q}
                    <svg
                      className="w-4 h-4 text-gray-500 group-open:rotate-45 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">{faq.a}</div>
                </details>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.04] to-transparent" />
        <Container>
          <RevealOnScroll direction="up">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Ready to Automate
                <br />
                <span className="text-emerald-400">Your Trading?</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Join traders who've replaced screen time with confidence.
                DevignFX handles the execution — you keep the profits.
              </p>
              <MagneticButton strength={20}>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-emerald-500 text-black font-bold text-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Get Your License Now
                </a>
              </MagneticButton>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="border-t border-white/[0.06] py-10">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[8px] font-black">
                FX
              </div>
              <span className="text-sm text-gray-500">
                DevignFX &copy; {new Date().getFullYear()}. A{" "}
                <a href="https://gr8qm.com" className="text-emerald-400 hover:underline">
                  GR8QM
                </a>{" "}
                product.
              </span>
            </div>
            <p className="text-[10px] text-gray-600 max-w-xs text-center md:text-right">
              Trading forex involves substantial risk of loss and is not suitable for all investors.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default DevignFXPage;
