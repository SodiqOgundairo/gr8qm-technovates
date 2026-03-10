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
          <Container className="flex flex-col md:flex-row justify-between items-center relative z-10">
            <div className="flex flex-col justify-center items-center md:items-start gap-4 my-4 md:my-0 text-center md:text-start w-full md:w-2/3">
              <ScrollReveal>
                <div className="bg-iceblue flex justify-center items-center py-1 px-2 lg:py-2 lg:px-4 rounded-full border border-skyblue gap-2 lg:gap-4">
                  <SparklesIcon size={16} className="text-skyblue" />
                  <p className="text-sm text-oxford">
                    Design-led. Purpose-driven.
                  </p>
                </div>
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
                <p className="text-dark md:text-sm lg:text-base lg:max-w-[550px]">
                  Strategy, design, and engineering under one roof. We craft
                  digital products, train the next wave of tech talent, and
                  deliver print that turns heads.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.6}>
                <div className="flex justify-start items-center flex-col md:flex-row gap-3 md:gap-5">
                  <Button to="/services" variant="pry">
                    See Our Work
                  </Button>
                  <Button to="/services/tech-training" variant="sec">
                    <div className="button-content">
                      Join the Academy
                      <ArrowRightIcon size={18} className="arrow" />
                    </div>
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            <div className="flex flex-col relative">
              <ScrollReveal delay={0.8}>
                <CloudinaryImage
                  imageKey="heroBg"
                  className=" hover:scale-105 transition-transform ease-in-out hover:-rotate-2 w-full lg:scale-105"
                  alt="Hero BG"
                />

                <div className="flex items-center absolute md:bottom-1 lg:left-10 lg:bottom-4 rounded-lg bg-white shadow-sm shadow-iceblue p-2 md:p-5 gap-4 hover:scale-110 hover:rotate-12">
                  <div className="p-2 bg-iceblue rounded-md">
                    <SparklesIcon size={24} className="text-skyblue" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-oxford">Pixel-perfect</p>
                    <p className="font-light text-gray-2 text-sm">
                      Every single time.
                    </p>
                  </div>
                </div>
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
                <h2 className="text-2xl md:text-3xl font-bold text-oxford">
                  Three things. Done exceptionally well.
                </h2>
                <p className="text-base text-gray-2 max-w-[612px]">
                  We don't try to do everything. We focus on what we're best at
                  and deliver work that speaks for itself.
                </p>
              </div>
            </ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between w-full gap-5 lg:gap-8">
              <ScrollReveal delay={0.2} width="100%">
                <div className="bg-none border border-iceblue flex p-8 flex-start flex-col gap-3 flex-1 rounded-3xl shadow-skyblue drop-shadow-xl h-full">
                  <div className="p-4 bg-light w-fit rounded-xl text-xl text-oxford">
                    <BrainCircuitIcon size={24} />
                  </div>
                  <p className="text-xl font-bold text-oxford">
                    Design & Engineering
                  </p>
                  <p className="text-base text-gray-2">
                    Websites, apps, and digital products built to perform and
                    designed to impress.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.4} width="100%">
                <div className="bg-none border border-iceblue flex p-8 flex-start flex-col gap-3 flex-1 rounded-3xl shadow-skyblue drop-shadow-xl h-full">
                  <div className="p-4 bg-light w-fit rounded-xl text-xl text-orange">
                    <SpiralIcon size={24} />
                  </div>
                  <p className="text-xl font-bold text-oxford">Tech Training</p>
                  <p className="text-base text-gray-2">
                    Sponsored programs that turn beginners into job-ready
                    developers and designers.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.6} width="100%">
                <div className="bg-none border border-iceblue flex p-8 flex-start flex-col gap-3 flex-1 rounded-3xl shadow-skyblue drop-shadow-xl h-full">
                  <div className="p-4 bg-light w-fit rounded-xl text-xl text-oxford">
                    <TrendingUpIcon size={24} />
                  </div>
                  <p className="text-xl font-bold text-oxford">Print Shop</p>
                  <p className="text-base text-gray-2">
                    Business cards, banners, merch, and packaging. Premium print
                    with fast turnaround.
                  </p>
                </div>
              </ScrollReveal>
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
            <Container className="flex flex-col justify-between items-center gap-4 md:gap-8 relative z-10">
              <ScrollReveal>
                <div className="bg-iceblue/20 flex justify-center items-center py-1 px-2 lg:py-2 lg:px-4 rounded-full border border-skyblue">
                  <p className="text-sm text-light">What We Deliver</p>
                </div>
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
                <ScrollReveal delay={0.2} width="100%">
                  <Card3D className="h-full">
                    <div className="bg-white rounded-2xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.05)] overflow-hidden h-full flex flex-col border-2 border-transparent group transition-colors duration-300 hover:border-skyblue hover:shadow-2xl">
                      <CloudinaryImage
                        imageKey="ResearchDesignImage"
                        className="group-hover:scale-105 transition-transform ease-in-out group-hover:-rotate-2 w-full h-56 md:h-48 lg:h-56 object-cover"
                        alt="Design & Build"
                      />
                      <div className="p-6 flex flex-col gap-3 grow">
                        <h3 className="text-lg font-bold text-oxford">
                          Design & Build
                        </h3>
                        <p className="text-gray-2 text-sm grow">
                          We don't just make things pretty. We architect digital
                          products that solve real problems, from first wireframe
                          to final deploy.
                        </p>
                        <Button
                          to="/services/design-build"
                          variant="sec"
                          className="w-fit mt-auto"
                        >
                          <div className="button-content">
                            Explore
                            <ArrowRightIcon size={18} className="arrow" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </Card3D>
                </ScrollReveal>

                <ScrollReveal delay={0.4} width="100%">
                  <Card3D className="h-full">
                    <div className="bg-white rounded-2xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.05)] overflow-hidden h-full flex flex-col border-2 border-transparent group transition-colors duration-300 hover:border-skyblue hover:shadow-2xl">
                      <CloudinaryImage
                        imageKey="TrainingImage"
                        className="group-hover:scale-105 transition-transform ease-in-out group-hover:-rotate-2 w-full h-56 md:h-48 lg:h-56 object-cover"
                        alt="Tech Training"
                      />
                      <div className="p-6 flex flex-col gap-3 grow">
                        <h3 className="text-lg font-bold text-oxford">
                          Tech Training
                        </h3>
                        <p className="text-gray-2 text-sm grow">
                          Zero to hired. Our sponsored cohorts teach product
                          design, development, and QA with real projects and
                          mentorship from working professionals.
                        </p>
                        <Button
                          to="/services/tech-training"
                          variant="sec"
                          className="w-fit mt-auto"
                        >
                          <div className="button-content">
                            Explore
                            <ArrowRightIcon size={18} className="arrow" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </Card3D>
                </ScrollReveal>

                <ScrollReveal delay={0.6} width="100%">
                  <Card3D className="h-full">
                    <div className="bg-white rounded-2xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.05)] overflow-hidden h-full flex flex-col border-2 border-transparent group transition-colors duration-300 hover:border-skyblue hover:shadow-2xl">
                      <CloudinaryImage
                        imageKey="PintShop"
                        className="group-hover:scale-105 transition-transform ease-in-out group-hover:-rotate-2 w-full h-56 md:h-48 lg:h-56 object-cover"
                        alt="Print Shop"
                      />

                      <div className="p-6 flex flex-col gap-3 grow">
                        <h3 className="text-lg font-bold text-oxford">
                          Print Shop
                        </h3>
                        <p className="text-gray-2 text-sm grow">
                          Your brand, tangible. Business cards, flyers, banners,
                          branded merch, and custom packaging. Quality print,
                          fast delivery.
                        </p>
                        <Button
                          to="/services/print-shop"
                          variant="sec"
                          className="w-fit mt-auto"
                        >
                          <div className="button-content">
                            Explore
                            <ArrowRightIcon size={18} className="arrow" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </Card3D>
                </ScrollReveal>
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
                    whileHover={{ y: -6 }}
                    className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm h-full"
                  >
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="text-lg font-bold text-oxford mb-2">
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
