import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getPublishedTerms, type GlossaryTerm } from "../lib/glossary";
import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import Container from "../components/layout/Container";
import { BookIcon } from "../components/icons";
import { Input } from "devign";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-gray-500/10 text-gray-400",
  web: "bg-skyblue/10 text-skyblue",
  design: "bg-orange/10 text-orange",
  data: "bg-green-500/10 text-green-400",
  ai: "bg-purple-500/10 text-purple-400",
};

export default function Glossary() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    getPublishedTerms()
      .then(setTerms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = terms;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      );
    }
    if (activeLetter) {
      result = result.filter((t) => t.letter === activeLetter);
    }
    return result;
  }, [terms, search, activeLetter]);

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const t of filtered) {
      const letter = t.letter || "#";
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const availableLetters = useMemo(
    () => new Set(terms.map((t) => t.letter)),
    [terms]
  );

  return (
    <PageTransition>
      <SEO
        title="Tech Glossary"
        description="A-Z glossary of tech, design, and digital terms. Learn the language of technology with GR8QM Technovates."
      />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <motion.div
            animate={{ x: [0, 80, -60, 0], y: [0, -50, 40, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 -left-32 w-[500px] h-[500px] rounded-full bg-skyblue/[0.08] blur-[120px]"
          />
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
                <BookIcon size={16} className="text-orange" />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-skyblue/50">
                  Digi Dictionary
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                Tech <span className="gradient-text">Glossary</span>
              </h1>
              <p className="text-iceblue/60 text-lg">
                Your A-Z guide to tech, design, and digital terms. Demystifying
                the language of technology.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Search + Alphabet */}
        <section className="sticky top-0 z-30 bg-oxford-deep/90 backdrop-blur-md border-b border-white/[0.06] py-4">
          <Container>
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search */}
              <div className="w-full md:w-80">
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search terms..."
                  leftIcon={<Search size={18} />}
                />
              </div>

              {/* Alphabet bar */}
              <div className="flex flex-wrap gap-1 justify-center flex-1">
                <button
                  onClick={() => setActiveLetter(null)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    !activeLetter
                      ? "bg-skyblue text-white"
                      : "text-iceblue/40 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  All
                </button>
                {ALPHABET.map((l) => (
                  <button
                    key={l}
                    onClick={() =>
                      setActiveLetter(activeLetter === l ? null : l)
                    }
                    disabled={!availableLetters.has(l)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      activeLetter === l
                        ? "bg-skyblue text-white"
                        : availableLetters.has(l)
                        ? "text-iceblue/50 hover:text-white hover:bg-white/[0.06]"
                        : "text-iceblue/15 cursor-not-allowed"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Terms */}
        <section className="py-16">
          <Container>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-5 bg-white/[0.04] rounded w-1/3 animate-pulse" />
                      <div className="h-5 bg-white/[0.04] rounded-full w-16 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/[0.04] rounded w-full animate-pulse" />
                      <div className="h-3 bg-white/[0.04] rounded w-4/5 animate-pulse" />
                      <div className="h-3 bg-white/[0.04] rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : grouped.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-iceblue/40 text-lg">
                  {search || activeLetter
                    ? "No terms match your search."
                    : "No glossary terms yet. Check back soon!"}
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {grouped.map(([letter, letterTerms]) => (
                  <div key={letter} id={`letter-${letter}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-5xl font-black text-skyblue/20">
                        {letter}
                      </span>
                      <div className="flex-1 h-px bg-white/[0.06]" />
                      <span className="text-xs text-iceblue/30">
                        {letterTerms.length} term{letterTerms.length !== 1 && "s"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {letterTerms.map((t, i) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.03 }}
                          className="group p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-skyblue/20 hover:bg-white/[0.04] transition-all"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-white font-bold text-lg group-hover:text-skyblue transition-colors">
                              {t.term}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                                CATEGORY_COLORS[t.category] || CATEGORY_COLORS.general
                              }`}
                            >
                              {t.category}
                            </span>
                          </div>
                          <p className="text-iceblue/60 text-sm leading-relaxed">
                            {t.definition}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
    </PageTransition>
  );
}
