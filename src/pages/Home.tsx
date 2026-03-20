import CloudinaryImage from "../utils/cloudinaryImage";
import Button from "../components/common/Button";
import Container from "../components/layout/Container";
import {
  SparklesIcon,
  BrainCircuitIcon,
  SpiralIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  TargetIcon,
  ShieldCheckIcon,
  HandshakeIcon,
} from "../components/icons";
import PageTransition from "../components/layout/PageTransition";
import ScrollReveal from "../components/common/ScrollReveal";
import TextReveal from "../components/animations/TextReveal";
import Card3D from "../components/animations/Card3D";
import FloatingShapes from "../components/animations/FloatingShapes";
import GeometricBackground from "../components/animations/GeometricBackground";
import Scene3D from "../components/animations/Scene3D";
import { SEO } from "../components/common/SEO";
import { getPageSEO } from "../utils/seo-config";
import {
  generateWebSiteSchema,
  generateBreadcrumbSchema,
} from "../utils/structured-data";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  const pageSEO = getPageSEO("home");

  const websiteSchema = generateWebSiteSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
  ]);

  return (
    <PageTransition>
      <SEO
        title={pageSEO.title}
        description={pageSEO.description}
        keywords={pageSEO.keywords}
        type={pageSEO.type}
        url="/"
        structuredData={[websiteSchema, breadcrumbSchema]}
      />
      <main className="flex flex-col">
        {/* Hero */}
        <div
          className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-linear-to-br from-skyblue/20 to-orange/20 relative overflow-hidden"
          id="hero"
        >
          <FloatingShapes variant="vibrant" />
          {/* Three.js particle layer behind content */}
          <Scene3D variant="minimal" className="opacity-40" />

          <Container className="flex flex-col md:flex-row justify-between items-center relative z-10">
            <div className="flex flex-col justify-center items-center md:items-start gap-4 my-4 md:my-0 text-center md:text-start w-full md:w-2/3">
              <ScrollReveal>
                <motion.div
                  className="bg-iceblue flex justify-center items-center py-1 px-2 lg:py-2 lg:px-4 rounded-full border border-skyblue gap-2 lg:gap-4"
                  whileHover={{ scale: 1.05, borderColor: "#0098da" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <motion.div
                    whileHover={{ rotate: 180, scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                  >
                    <SparklesIcon size={16} className="text-skyblue" />
                  </motion.div>
                  <p className="text-sm text-oxford">
                    Design-led. Purpose-driven.
                  </p>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black md:leadin lg:leading-20 tracking-tighter lg:max-w-[690px] flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-1">
                  <TextReveal className="text-oxford inline-block" delay={0.2}>
                    We design
                  </TextReveal>
                  <TextReveal className="text-skyblue inline-block" delay={0.4}>
                    what's next.
                  </TextReveal>
                  <TextReveal className="text-oxford inline-block" delay={0.6}>
                    We build
                  </TextReveal>
                  <TextReveal className="text-orange inline-block" delay={0.8}>
                    what matters.
                  </TextReveal>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <motion.p
                  className="text-dark md:text-sm lg:text-base lg:max-w-[550px]"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  Strategy, design, and engineering under one roof. We craft
                  digital products, train the next wave of tech talent, and
                  deliver print that turns heads.
                </motion.p>
              </ScrollReveal>

              <ScrollReveal delay={0.6}>
                <div className="flex justify-start items-center flex-col md:flex-row gap-3 md:gap-5">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button to="/services" variant="pry">
                      See Our Work
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button to="/services/tech-training" variant="sec">
                      <div className="button-content">
                        Join the Academy
                        <ArrowRightIcon size={18} className="arrow" />
                      </div>
                    </Button>
                  </motion.div>
                </div>
              </ScrollReveal>
            </div>

            <div className="flex flex-col relative">
              <ScrollReveal delay={0.8}>
                <motion.div
                  whileHover={{ scale: 1.03, rotate: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CloudinaryImage
                    imageKey="heroBg"
                    className="w-full lg:scale-105 transition-transform ease-in-out"
                    alt="Hero BG"
                  />
                </motion.div>

                <motion.div
                  className="flex items-center absolute md:bottom-1 lg:left-10 lg:bottom-4 rounded-lg bg-white shadow-sm shadow-iceblue p-2 md:p-5 gap-4"
                  whileHover={{ scale: 1.1, rotate: 5, y: -5 }}
                  whileTap={{ scale: 0.95, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  drag
                  dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
                  dragElastic={0.1}
                >
                  <motion.div
                    className="p-2 bg-iceblue rounded-md"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <SparklesIcon size={24} className="text-skyblue" />
                  </motion.div>
                  <div className="flex flex-col">
                    <p className="font-bold text-oxford">Pixel-perfect</p>
                    <p className="font-light text-gray-2 text-sm">
                      Every single time.
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </Container>
        </div>

        {/* What We Do */}
        <div
          className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-light relative overflow-hidden"
          id="purpose"
        >
          <GeometricBackground />
          <Container className="flex flex-col justify-between items-center gap-4 md:gap-8 relative z-10">
            <ScrollReveal>
              <div className="flex flex-col text-center md:gap-3 ">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold text-oxford"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  Three things. Done exceptionally well.
                </motion.h2>
                <p className="text-base text-gray-2 max-w-[612px]">
                  We don't try to do everything. We focus on what we're best at
                  and deliver work that speaks for itself.
                </p>
              </div>
            </ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between w-full gap-5 lg:gap-8">
              {[
                {
                  icon: <BrainCircuitIcon size={24} />,
                  iconColor: "text-oxford",
                  title: "Design & Engineering",
                  desc: "Websites, apps, and digital products built to perform and designed to impress.",
                  delay: 0.2,
                },
                {
                  icon: <SpiralIcon size={24} />,
                  iconColor: "text-orange",
                  title: "Tech Training",
                  desc: "Sponsored programs that turn beginners into job-ready developers and designers.",
                  delay: 0.4,
                },
                {
                  icon: <TrendingUpIcon size={24} />,
                  iconColor: "text-oxford",
                  title: "Print Shop",
                  desc: "Business cards, banners, merch, and packaging. Premium print with fast turnaround.",
                  delay: 0.6,
                },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={item.delay} width="100%">
                  <motion.div
                    className="bg-none border border-iceblue flex p-8 flex-start flex-col gap-3 flex-1 rounded-3xl shadow-skyblue drop-shadow-xl h-full"
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      borderColor: "#0098da",
                      boxShadow: "0 20px 40px rgba(0, 152, 218, 0.15)",
                    }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className={`p-4 bg-light w-fit rounded-xl text-xl ${item.iconColor}`}
                      whileHover={{ rotate: 15, scale: 1.15 }}
                      whileTap={{ rotate: -15, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {item.icon}
                    </motion.div>
                    <p className="text-xl font-bold text-oxford">
                      {item.title}
                    </p>
                    <p className="text-base text-gray-2">{item.desc}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>

        {/* Pillars */}
        <div className="flex flex-col bg-iceblue">
          <div
            className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-oxford relative overflow-hidden"
            id="pillars"
          >
            <FloatingShapes variant="dark" />
            <Scene3D variant="minimal" className="opacity-20" />
            <Container className="flex flex-col justify-between items-center gap-4 md:gap-8 relative z-10">
              <ScrollReveal>
                <motion.div
                  className="bg-iceblue/20 flex justify-center items-center py-1 px-2 lg:py-2 lg:px-4 rounded-full border border-skyblue"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(201,235,251,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="text-sm text-light">What We Deliver</p>
                </motion.div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="flex flex-col text-center md:gap-3 ">
                  <h2 className="text-2xl md:text-3xl font-bold text-iceblue">
                    From Concept to Launch
                  </h2>
                  <p className="text-base text-iceblue max-w-[612px]">
                    Every project gets the full treatment: strategy, design,
                    development, and ongoing support.
                  </p>
                </div>
              </ScrollReveal>
            </Container>
          </div>
          <div className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-iceblue">
            <Container className="flex flex-col justify-between items-center gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-8 w-full">
                {([
                  {
                    imageKey: "ResearchDesignImage" as const,
                    alt: "Design & Build",
                    title: "Design & Build",
                    desc: "We don't just make things pretty. We architect digital products that solve real problems, from first wireframe to final deploy.",
                    link: "/services/design-build",
                    delay: 0.2,
                  },
                  {
                    imageKey: "TrainingImage" as const,
                    alt: "Tech Training",
                    title: "Tech Training",
                    desc: "Zero to hired. Our sponsored cohorts teach product design, development, and QA with real projects and mentorship from working professionals.",
                    link: "/services/tech-training",
                    delay: 0.4,
                  },
                  {
                    imageKey: "PintShop" as const,
                    alt: "Print Shop",
                    title: "Print Shop",
                    desc: "Your brand, tangible. Business cards, flyers, banners, branded merch, and custom packaging. Quality print, fast delivery.",
                    link: "/services/print-shop",
                    delay: 0.6,
                  },
                ]).map((card, i) => (
                  <ScrollReveal key={i} delay={card.delay} width="100%">
                    <Card3D className="h-full">
                      <motion.div
                        className="bg-white rounded-2xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.05)] overflow-hidden h-full flex flex-col border-2 border-transparent group transition-colors duration-300"
                        whileHover={{
                          borderColor: "#0098da",
                          boxShadow: "0 25px 50px rgba(0, 152, 218, 0.15)",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="overflow-hidden">
                          <motion.div
                            whileHover={{ scale: 1.08, rotate: -2 }}
                            whileTap={{ scale: 1.02, rotate: 1 }}
                            transition={{ type: "spring" as const, stiffness: 200 }}
                          >
                            <CloudinaryImage
                              imageKey={card.imageKey}
                              className="w-full h-56 md:h-48 lg:h-56 object-cover"
                              alt={card.alt}
                            />
                          </motion.div>
                        </div>
                        <div className="p-6 flex flex-col gap-3 grow">
                          <h3 className="text-lg font-bold text-oxford">
                            {card.title}
                          </h3>
                          <p className="text-gray-2 text-sm grow">
                            {card.desc}
                          </p>
                          <motion.div
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-fit mt-auto"
                          >
                            <Button
                              to={card.link}
                              variant="sec"
                              className="w-fit"
                            >
                              <div className="button-content">
                                Explore
                                <ArrowRightIcon size={18} className="arrow" />
                              </div>
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </Card3D>
                  </ScrollReveal>
                ))}
              </div>
            </Container>
          </div>
        </div>

        {/* Why Partner */}
        <div className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-light relative overflow-hidden">
          <FloatingShapes variant="soft" className="opacity-50" />
          <Container className="relative z-10">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-oxford mb-3">
                  Why teams choose Gr8QM
                </h2>
                <p className="text-gray-2 max-w-xl mx-auto">
                  We bring design thinking, technical depth, and a bias for
                  shipping. Here's what that looks like in practice.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <TargetIcon size={28} className="text-skyblue" />,
                  title: "Purpose-Driven Design",
                  desc: "Every pixel serves a goal. We design solutions that actually move the needle for your users and your business.",
                },
                {
                  icon: <HandshakeIcon size={28} className="text-orange" />,
                  title: "True Partnership",
                  desc: "We don't just hand off deliverables. We embed with your team, understand your context, and build together.",
                },
                {
                  icon: <ShieldCheckIcon size={28} className="text-oxford" />,
                  title: "Built to Last",
                  desc: "Clean code, scalable architecture, and ongoing support. We measure what we create and make sure it endures.",
                },
              ].map((item, index) => (
                <ScrollReveal key={index} delay={index * 0.15} width="100%">
                  <motion.div
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0, 152, 218, 0.1)",
                    }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm h-full group"
                  >
                    <motion.div
                      className="mb-4"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {item.icon}
                    </motion.div>
                    <h3 className="text-lg font-bold text-oxford mb-2 group-hover:text-skyblue transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-2 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>
      </main>
    </PageTransition>
  );
};

export default Home;
