import React from "react";
import Container from "../components/layout/Container";
import CloudinaryImage from "../utils/cloudinaryImage";
import Button from "../components/common/Button";
import Card from "../components/layout/Card";
import {
  SparklesIcon,
  SpiralIcon,
  HeartIcon,
  TrendingUpIcon,
  BulbIcon,
  UserIcon,
  BadgeIcon,
  ShieldCheckIcon,
} from "../components/icons";
import { motion } from "framer-motion";
import Scene3D from "../components/animations/Scene3D";

import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import ScrollReveal from "../components/common/ScrollReveal";
import { getPageSEO } from "../utils/seo-config";
import { generateBreadcrumbSchema } from "../utils/structured-data";

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 15,
};

const AboutPage: React.FC = () => {
  const pageSEO = getPageSEO("about");

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
    { name: "About", url: "https://gr8qm.com/about" },
  ]);

  return (
    <PageTransition>
      <SEO
        title={pageSEO.title}
        description={pageSEO.description}
        keywords={pageSEO.keywords}
        type={pageSEO.type}
        url="/about"
        structuredData={[breadcrumbSchema]}
      />
      <main className="flex flex-col">
        <div className="relative overflow-hidden py-12 md:py-20 lg:py-28 xl:py-32 2xl:py-40 bg-linear-to-br from-skyblue/20 to-orange/20">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container className="relative z-10 flex flex-col md:flex-row w-full justify-between items-center gap-8">
            <div className="flex flex-col gap-4 text-center md:text-left w-full md:w-2/3">
              <ScrollReveal className="w-full">
                <div className="bg-skyblue rounded-2xl p-4 py-8 md:p-5 lg:p-16 xl:p-16 2xl:p-24 space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={springTransition}
                    className="bg-iceblue/40 border border-skyblue rounded-full px-4 py-2 w-fit mx-auto md:mx-0 flex items-center gap-2"
                  >
                    <motion.span
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      <SparklesIcon size={16} className="text-oxford" />
                    </motion.span>
                    <p className="text-sm text-oxford">The Gr8QM Story</p>
                  </motion.div>
                  <motion.h1
                    whileHover={{ scale: 1.02 }}
                    transition={springTransition}
                    className="text-3xl lg:text-4xl font-black tracking-tight wrap-break-word"
                  >
                    <span className="text-white">We design</span>{" "}
                    <span className="text-oxford">what's next.</span>
                    <br />
                    <span className="text-white">We build</span>{" "}
                    <span className="text-oxford">what lasts.</span>
                  </motion.h1>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <motion.div
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0, 152, 218, 0.1)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={springTransition}
                  className="bg-orange p-4 md:p-5 lg:p-6 rounded-2xl"
                >
                  <p className="text-light lg:text-base max-w-[650px] mx-auto md:mx-0">
                    We're a design and technology studio that believes great work
                    comes from clarity of purpose. Every product we ship, every
                    student we train, every print we deliver reflects our
                    commitment to craft and impact.
                  </p>
                </motion.div>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.4} className="w-full md:w-1/3" width="100%">
              <CloudinaryImage
                imageKey="aboutUsHero"
                className="object-cover w-full max-w-[600px]"
                alt="About Us Hero"
              />
            </ScrollReveal>
          </Container>
        </div>

        <div id="mission" className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-light">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container className="relative z-10 flex flex-col lg:flex-row justify-center gap-10 items-center">
            <ScrollReveal>
              <CloudinaryImage
                imageKey="visionMision"
                className=" hover:scale-105 transition-transform ease-in-out hover:-rotate-2 w-full lg:scale-105"
                alt="Vision and Mission"
              />
            </ScrollReveal>
            <div className="flex flex-col items-start gap-12">
              <ScrollReveal delay={0.2}>
                <div className="flex flex-col gap-4">
                  <motion.h2
                    whileHover={{ scale: 1.02 }}
                    transition={springTransition}
                    className="text-2xl md:text-3xl font-bold text-oxford flex justify-start items-start gap-4"
                  >
                    <motion.span
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      <SpiralIcon size={28} className="text-skyblue" />
                    </motion.span>
                    Our Vision
                  </motion.h2>
                  <p className="text-gray-2">
                    A world where technology serves people, not the other way
                    around. We envision communities thriving because the tools
                    they use were built with intention, empathy, and excellence.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <div className="flex flex-col gap-4">
                  <motion.h2
                    whileHover={{ scale: 1.02 }}
                    transition={springTransition}
                    className="text-2xl md:text-3xl font-bold text-oxford flex justify-start items-start gap-4"
                  >
                    <motion.span
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      <SparklesIcon size={28} className="text-orange" />
                    </motion.span>
                    Our Mission
                  </motion.h2>
                  <p className="text-gray-2">
                    To equip individuals and organizations with beautifully
                    designed, expertly engineered solutions. We train talent,
                    build products, and deliver print that makes people stop and
                    look twice.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.6}>
                <motion.div
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0, 152, 218, 0.1)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={springTransition}
                  className="bg-iceblue p-4 md:p-6 rounded-2xl"
                >
                  <p className="text-base font-bold italic text-oxford">
                    "Good design is good business. Great design changes lives."
                  </p>
                </motion.div>
              </ScrollReveal>
            </div>
          </Container>
        </div>

        <div className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-iceblue">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container className="relative z-10 flex flex-col gap-8">
            <ScrollReveal>
              <div className="flex flex-col gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springTransition}
                  className="bg-light w-fit m-auto py-2 px-4 rounded-full"
                >
                  <p className="text-sm text-skyblue">What Drives Us</p>
                </motion.div>
                <div className="flex-col flex gap-2 w-full">
                  <motion.h2
                    whileHover={{ scale: 1.02 }}
                    transition={springTransition}
                    className="text-2xl md:text-3xl font-bold text-oxford text-center"
                  >
                    Our Core Values
                  </motion.h2>
                  <p className="text-base text-dark text-center md:text-sm lg:text-base ">
                    The principles behind every pixel, every line of code, and
                    every decision we make.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <HeartIcon size={24} className="text-skyblue" />,
                  title: "Purpose First",
                  desc: "We start with why. Every project begins with understanding the real problem before reaching for solutions.",
                  bg: "bg-skyblue/20",
                },
                {
                  icon: <BulbIcon size={24} className="text-orange" />,
                  title: "Relentless Craft",
                  desc: "We obsess over the details. The spacing, the transitions, the edge cases. Because good enough isn't.",
                  bg: "bg-orange/20",
                },
                {
                  icon: <UserIcon size={24} className="text-skyblue" />,
                  title: "Inclusive Growth",
                  desc: "We build systems that leave no one behind. Our training programs are designed for people from every background.",
                  bg: "bg-skyblue/20",
                },
                {
                  icon: <BadgeIcon size={24} className="text-oxford" />,
                  title: "Excellence as Standard",
                  desc: "We don't have a 'premium tier.' The standard is premium. Every client gets our best work.",
                  bg: "bg-oxford/20",
                },
                {
                  icon: <TrendingUpIcon size={24} className="text-orange" />,
                  title: "Measurable Impact",
                  desc: "Pretty isn't enough. We track outcomes, iterate on feedback, and make sure our work actually moves metrics.",
                  bg: "bg-orange/20",
                },
                {
                  icon: <ShieldCheckIcon size={24} className="text-oxford" />,
                  title: "Integrity Always",
                  desc: "Honest timelines, transparent pricing, and straight talk. We'd rather lose a deal than overpromise.",
                  bg: "bg-oxford/20",
                },
              ].map((item, index) => (
                <ScrollReveal key={index} delay={index * 0.1} width="100%">
                  <motion.div
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0, 152, 218, 0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={springTransition}
                    className="h-full group"
                  >
                    <Card className="border border-skyblue bg-light rounded-xl gap-3 px-4 py-8 md:px-5 md:py-8 lg:px-8 lg:py-10 flex flex-col items-start drop-shadow-2xs h-full">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        whileTap={{ rotate: -10, scale: 0.9 }}
                        className={`rounded-lg p-2 ${item.bg}`}
                      >
                        {item.icon}
                      </motion.div>
                      <p className="text-oxford font-bold group-hover:text-skyblue transition-colors duration-300">
                        {item.title}
                      </p>
                      <p className="text-gray-3">{item.desc}</p>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>

        <div className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-light">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container className="relative z-10 flex flex-col items-center gap-6 text-center">
            <ScrollReveal>
              <motion.h3
                whileHover={{ scale: 1.02 }}
                transition={springTransition}
                className="text-xl md:text-2xl font-bold text-oxford"
              >
                Ready to work with a team that cares as much as you do?
              </motion.h3>
              <p className="text-gray-2 max-w-3xl mb-6">
                We bring design thinking, engineering rigor, and a genuine
                passion for craft to every project. If you're building something
                that matters, we want to be part of it.
              </p>
              <motion.div
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0, 152, 218, 0.1)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={springTransition}
                className="inline-block"
              >
                <Button to="/contact" variant="pry">
                  Let's talk
                </Button>
              </motion.div>
            </ScrollReveal>
          </Container>
        </div>
      </main>
    </PageTransition>
  );
};

export default AboutPage;
