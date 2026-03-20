import React from "react";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { ArrowRightIcon, GraduationCapIcon } from "../../components/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import PageTransition from "../../components/layout/PageTransition";
import { SEO } from "../../components/common/SEO";
import { getPageSEO } from "../../utils/seo-config";
import {
  generateFAQSchema,
  generateEducationalOrganizationSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";

import OrbitalBackground from "../../components/animations/OrbitalBackground";
import {
  Reveal,
  DotGrid,
  DiagonalLines,
  CrossMark,
  AccentLine,
  FloatingRule,
  SectionConnector,
} from "../../components/animations/DesignElements";

const TechTrainingNewPage: React.FC = () => {
  const navigate = useNavigate();
  const pageSEO = getPageSEO("techTraining");

  const courses = [
    {
      title: "Product Design",
      description:
        "Master UI/UX design principles and create stunning interfaces",
      icon: "🎨",
      duration: "12 weeks",
    },
    {
      title: "Product Management",
      description: "Learn to build and manage successful digital products",
      icon: "📊",
      duration: "10 weeks",
    },
    {
      title: "Frontend Development",
      description:
        "Build modern, responsive web applications with React & Next.js",
      icon: "💻",
      duration: "16 weeks",
    },
    {
      title: "Backend Development",
      description: "Create robust server-side applications and APIs",
      icon: "⚙️",
      duration: "16 weeks",
    },
    {
      title: "DevOps Engineering",
      description: "Master cloud infrastructure and deployment workflows",
      icon: "☁️",
      duration: "14 weeks",
    },
    {
      title: "Cybersecurity",
      description: "Protect systems and data from digital threats",
      icon: "🔒",
      duration: "12 weeks",
    },
  ];

  const benefits = [
    {
      icon: "🎓",
      description:
        "World-class education. You only pay a commitment fee to secure your spot.",
    },
    {
      icon: "👨‍💼",
      title: "Industry Experts",
      description:
        "Learn from professionals with years of real-world experience.",
    },
    {
      icon: "🤝",
      title: "Job Placement Support",
      description:
        "We help you land your first tech role with career guidance.",
    },
    {
      icon: "💡",
      title: "Hands-on Projects",
      description:
        "Build a portfolio of real projects that showcase your skills.",
    },
  ];

  const faqs = [
    {
      question: "Is the training sponsored?",
      answer:
        "Yes! The training is fully sponsored. The commitment fee ensures serious learners and secures your place in the cohort.",
    },
    {
      question: "What is the commitment fee for?",
      answer:
        "The commitment fee demonstrates your dedication. It allows us to prioritize applicants who are ready to complete the rigorous curriculum.",
    },
    {
      question: "What happens if I miss a class?",
      answer:
        "All sessions are recorded, so you can catch up. However, active participation is key to mastering the material.",
    },
    {
      question: "Do I need prior experience?",
      answer:
        "Most courses are beginner-friendly, though some may have prerequisites. Check individual course details for requirements.",
    },
  ];

  // Generate structured data
  const faqSchema = generateFAQSchema(faqs);
  const eduOrgSchema = generateEducationalOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
    { name: "Services", url: "https://gr8qm.com/services" },
    { name: "Tech Training", url: "https://gr8qm.com/services/tech-training" },
  ]);

  return (
    <PageTransition>
      <SEO
        title={pageSEO.title}
        description={pageSEO.description}
        keywords={pageSEO.keywords}
        type={pageSEO.type}
        url="/services/tech-training"
        structuredData={[faqSchema, eduOrgSchema, breadcrumbSchema]}
      />
      <main className="flex flex-col overflow-x-hidden">

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-oxford-deep sticky top-0 z-10">
          <OrbitalBackground variant="hero" />

          {/* Geometric decorations */}
          <DotGrid className="top-8 left-8 text-skyblue/20" />
          <DiagonalLines className="bottom-0 right-0 text-orange/10" thick />
          <CrossMark className="absolute top-[15%] right-[20%] text-skyblue/15" size={20} />
          <CrossMark className="absolute bottom-[20%] left-[12%] text-orange/15" size={14} />

          {/* Floating geometric shapes */}
          <motion.div
            className="absolute top-[22%] right-[10%] w-24 h-24 border border-skyblue/10 rounded-full"
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute bottom-[25%] left-[8%] w-16 h-16 border border-orange/10 rotate-45"
            animate={{ rotate: [45, 90, 45], opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />

          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

          <Container className="relative z-10 flex flex-col md:flex-row items-center gap-12 py-16 md:py-28 lg:py-36">
            <div className="flex-1 flex flex-col gap-6">
              <Reveal>
                <motion.div
                  className="bg-skyblue/10 border border-oxford-border rounded-full px-4 py-2 w-fit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="text-sm text-iceblue/70 font-medium tracking-widest uppercase">
                    Tech Training
                  </p>
                </motion.div>
              </Reveal>
              <Reveal delay={0.15}>
                <AccentLine color="skyblue" thickness="medium" width="w-16" className="mb-2" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="text-white">Launch Your Tech Career,</span>{" "}
                  <span className="text-skyblue">Sponsored</span>
                </h1>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-lg md:text-xl text-iceblue/70 leading-relaxed">
                  Master in-demand tech skills with our specialized training
                  programs. Learn from industry experts, build real projects,
                  and start your journey to a rewarding tech career. Only a
                  small commitment fee required.
                </p>
              </Reveal>
              <Reveal delay={0.45}>
                <div className="flex gap-4 flex-wrap">
                  <Button variant="pry" onClick={() => navigate("/trainings")}>
                    Browse Courses
                    <ArrowRightIcon size={20} />
                  </Button>
                  <Button
                    variant="sec"
                    onClick={() =>
                      navigate("/portfolio?category=tech-training")
                    }
                  >
                    <div className="button-content">
                      Student Success Stories
                      <ArrowRightIcon size={18} className="arrow" />
                    </div>
                  </Button>
                </div>
              </Reveal>
            </div>
            <div className="flex-1">
              <Reveal delay={0.6}>
                <div className="overflow-hidden rounded-2xl border border-oxford-border">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <CloudinaryImage
                      imageKey="TrainingImage"
                      className="rounded-2xl"
                      alt="Tech Training"
                    />
                  </motion.div>
                </div>
              </Reveal>
            </div>
          </Container>

          <SectionConnector color="skyblue" side="right" />
        </section>

        {/* ═══════════════ WHY SPONSORED SECTION ═══════════════ */}
        <section className="relative py-20 md:py-28 bg-oxford-deep sticky top-0 z-20 overflow-hidden">
          <OrbitalBackground variant="section" />

          <DotGrid className="top-12 right-12 text-orange/15" />
          <CrossMark className="absolute top-[10%] left-[18%] text-skyblue/12" size={16} />
          <FloatingRule className="bottom-0 left-0 w-full" color="orange" dashed />

          <Container className="relative z-10">
            <Reveal>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <AccentLine color="orange" thickness="medium" width="w-12" className="mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Launch Your Tech Career with <br />
                  <span className="text-skyblue">Sponsored Training</span>
                </h2>
                <p className="text-base text-iceblue/70 max-w-[612px] mx-auto mt-3">
                  We believe financial barriers shouldn't stop talent. Start
                  your journey to a rewarding tech career. Only a small
                  commitment fee required.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <motion.div
                className="bg-white/5 backdrop-blur-sm border border-oxford-border rounded-2xl p-8 max-w-2xl mx-auto"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    whileTap={{ rotate: -10, scale: 0.9 }}
                  >
                    💡
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Commitment Fee Policy
                    </h3>
                    <p className="text-iceblue/70">
                      Pay a one-time commitment fee when you enroll. This
                      secures your spot and ensures serious participation in the
                      cohort. It's that simple.
                    </p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </Container>

          <SectionConnector color="orange" side="left" />
        </section>

        {/* ═══════════════ AVAILABLE COURSES SECTION ═══════════════ */}
        <section className="relative py-20 md:py-28 bg-oxford-deep sticky top-0 z-30 overflow-hidden">
          <OrbitalBackground variant="section" />

          <DiagonalLines className="top-0 left-0 text-skyblue/8" />
          <CrossMark className="absolute bottom-[12%] right-[15%] text-orange/12" size={18} />
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" />

          <Container className="relative z-10">
            <Reveal>
              <div className="text-center mb-12">
                <AccentLine color="skyblue" thickness="medium" width="w-14" className="mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Available Courses
                </h2>
                <p className="text-iceblue/70 text-lg max-w-2xl mx-auto">
                  Choose from our range of industry-leading tech programs
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <Reveal key={index} delay={index * 0.08}>
                  <motion.div
                    className="group bg-white/5 backdrop-blur-sm border border-oxford-border rounded-xl p-6 h-full cursor-default"
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      borderColor: "rgba(0,152,218,0.4)",
                      boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="text-5xl mb-4"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      {course.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-skyblue transition-colors duration-300">
                      {course.title}
                    </h3>
                    <p className="text-iceblue/70 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-iceblue/50">
                      <motion.span
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ⏱️ {course.duration}
                      </motion.span>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.4}>
              <div className="text-center mt-8">
                <Button variant="pry" onClick={() => navigate("/trainings")}>
                  View All Courses & Apply
                  <ArrowRightIcon size={20} />
                </Button>
              </div>
            </Reveal>
          </Container>

          <SectionConnector color="skyblue" side="right" />
        </section>

        {/* ═══════════════ BENEFITS SECTION ═══════════════ */}
        <section className="relative py-20 md:py-28 bg-oxford-deep sticky top-0 z-40 overflow-hidden">
          <OrbitalBackground variant="section" />

          <DotGrid className="bottom-8 left-8 text-skyblue/15" />
          <DiagonalLines className="top-0 right-0 text-orange/8" thick />
          <CrossMark className="absolute top-[18%] right-[22%] text-skyblue/12" size={16} />
          <CrossMark className="absolute bottom-[15%] left-[10%] text-orange/10" size={12} />

          <FloatingRule className="top-0 left-0 w-full" color="orange" dashed />

          <Container className="relative z-10">
            <Reveal>
              <div className="text-center mb-12">
                <AccentLine color="iceblue" thickness="medium" width="w-12" className="mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Why Choose <span className="text-iceblue">Gr8QM</span>{" "}
                  Training?
                </h2>
                <p className="text-iceblue/70 text-lg max-w-2xl mx-auto">
                  More than just courses—a complete career transformation
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Reveal key={index} delay={index * 0.12}>
                  <motion.div
                    className="group bg-white/5 backdrop-blur-sm border border-oxford-border rounded-xl p-6 text-center h-full cursor-default"
                    whileHover={{
                      y: -6,
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="text-5xl mb-4"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      {benefit.icon}
                    </motion.div>
                    <h3 className="text-lg font-bold mb-3 text-iceblue group-hover:text-orange transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-iceblue/70 text-sm">
                      {benefit.description}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </Container>

          <SectionConnector color="orange" side="left" />
        </section>

        {/* ═══════════════ HOW IT WORKS SECTION ═══════════════ */}
        <section className="relative py-20 md:py-28 bg-oxford-deep sticky top-0 z-50 overflow-hidden">
          <OrbitalBackground variant="section" />

          <DotGrid className="top-8 right-8 text-skyblue/12" />
          <CrossMark className="absolute bottom-[18%] right-[18%] text-orange/12" size={14} />
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

          <Container className="relative z-10">
            <Reveal>
              <div className="text-center mb-12">
                <AccentLine color="orange" thickness="medium" width="w-14" className="mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  How It Works
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Choose a Course",
                  desc: "Browse our courses and select one that fits your goals",
                },
                {
                  step: "2",
                  title: "Apply & Pay Fee",
                  desc: "Fill the application form and pay the commitment fee",
                },
                {
                  step: "3",
                  title: "Learn & Build",
                  desc: "Attend classes, work on projects, and gain real skills",
                },
                {
                  step: "4",
                  title: "Graduate & Succeed",
                  desc: "Complete the course and land your dream job",
                },
              ].map((item, index) => (
                <Reveal key={index} delay={index * 0.12}>
                  <motion.div
                    className="group text-center relative h-full cursor-default"
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="bg-skyblue/20 border border-oxford-border text-skyblue text-2xl font-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-skyblue transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-iceblue/70">{item.desc}</p>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-8 -right-4 transform z-10">
                        <ArrowRightIcon size={32} className="text-skyblue/40" />
                      </div>
                    )}
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </Container>

          <SectionConnector color="skyblue" side="center" />
        </section>

        {/* ═══════════════ FAQS SECTION ═══════════════ */}
        <section className="relative py-20 md:py-28 bg-oxford-deep sticky top-0 z-[60] overflow-hidden">
          <OrbitalBackground variant="section" />

          <DiagonalLines className="bottom-0 left-0 text-skyblue/6" />
          <CrossMark className="absolute top-[12%] left-[20%] text-orange/10" size={16} />
          <CrossMark className="absolute bottom-[10%] right-[14%] text-skyblue/10" size={12} />
          <FloatingRule className="top-0 left-0 w-full" color="orange" />

          <Container className="relative z-10">
            <Reveal>
              <div className="text-center mb-12">
                <AccentLine color="skyblue" thickness="medium" width="w-12" className="mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
              </div>
            </Reveal>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Reveal key={index} delay={index * 0.08}>
                  <motion.div
                    className="group bg-white/5 backdrop-blur-sm border border-oxford-border rounded-xl p-6 cursor-default"
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,152,218,0.08)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15 }}
                  >
                    <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2 group-hover:text-skyblue transition-colors duration-300">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        whileTap={{ rotate: -10, scale: 0.9 }}
                      >
                        <GraduationCapIcon size={18} className="text-skyblue mt-1 shrink-0" />
                      </motion.div>
                      {faq.question}
                    </h3>
                    <p className="text-iceblue/70 pl-7">{faq.answer}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </Container>

          <SectionConnector color="orange" side="right" />
        </section>

        {/* ═══════════════ CTA SECTION ═══════════════ */}
        <section className="relative py-20 md:py-28 bg-oxford-deep sticky top-0 z-[70] overflow-hidden">
          <OrbitalBackground variant="cta" />

          <DotGrid className="top-8 left-8 text-skyblue/15" />
          <DotGrid className="bottom-8 right-8 text-orange/10" />
          <DiagonalLines className="top-0 right-0 text-skyblue/6" />
          <CrossMark className="absolute top-[20%] right-[25%] text-orange/12" size={18} />
          <CrossMark className="absolute bottom-[25%] left-[18%] text-skyblue/10" size={14} />

          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed thick />

          <Container className="relative z-10 text-center">
            <Reveal>
              <AccentLine color="orange" thickness="thick" width="w-16" className="mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-iceblue/70 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of students who have launched successful tech
                careers through our specialized training programs.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  variant="pry"
                  onClick={() => navigate("/trainings")}
                >
                  Browse Courses
                  <ArrowRightIcon size={20} />
                </Button>
                <Button
                  variant="sec"
                  onClick={() => navigate("/portfolio?category=tech-training")}
                >
                  See Student Work
                  <ArrowRightIcon size={18} className="arrow" />
                </Button>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
    </PageTransition>
  );
};

export default TechTrainingNewPage;
