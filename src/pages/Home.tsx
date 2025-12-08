import CloudinaryImage from "../utils/cloudinaryImage";
import { HiArrowLongRight } from "react-icons/hi2";
import { PiSparkleLight, PiSpiral } from "react-icons/pi";
import Button from "../components/common/Button";
import { LuBrain } from "react-icons/lu";
import { RiExchange2Line } from "react-icons/ri";
import Container from "../components/layout/Container";
import PageTransition from "../components/layout/PageTransition";
import ScrollReveal from "../components/common/ScrollReveal";

import { motion } from "framer-motion";
import { SEO } from "../components/common/SEO";

const Home: React.FC = () => {
  return (
    <PageTransition>
      <SEO
        title="Home"
        description="Faith that builds. Impact that lasts. We are a kingdom-rooted innovation collective advancing AI through thoughtful research, purposeful design, and principled development."
      />
      <main className="flex flex-col">
        <div
          className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-linear-to-br from-skyblue/20 to-orange/20"
          id="hero"
        >
          <Container className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col justify-center items-center md:items-start gap-4 my-4 md:my-0 text-center md:text-start w-full md:w-2/3">
              <ScrollReveal>
                <div className="bg-iceblue flex justify-center items-center py-1 px-2 lg:py-2 lg:px-4 rounded-full border border-skyblue gap-2 lg:gap-4">
                  <PiSparkleLight className="text-sm text-skyblue" />
                  <p className="text-sm  text-oxford">
                    Kingdom-Rooted Innovation
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black md:leadin lg:leading-20 tracking-tighter lg:max-w-[690px]">
                  <span className="text-skyblue">Faith</span>{" "}
                  <span className="text-oxford">that builds. </span>
                  <span className="text-orange">Impact</span>{" "}
                  <span className="text-oxford">that lasts.</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <p className="text-dark md:text-sm lg:text-base lg:max-w-[550px]">
                  {" "}
                  We are a kingdom-rooted innovation collective advancing AI
                  through thoughtful research, purposeful design, and principled
                  development. Transforming lives through technology anchored in
                  faith.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.6}>
                <div className="flex justify-start items-center flex-col md:flex-row gap-3 md:gap-5">
                  <Button to="/services" variant="pry">
                    Explore Solutions
                  </Button>
                  <Button to="/services/tech-training" variant="sec">
                    <div className="button-content">
                      Academy
                      <HiArrowLongRight className="arrow" />
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
                    <PiSparkleLight className="text-2xl text-skyblue" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-oxford">Excellence in</p>
                    <p className="font-light text-gray-2 text-sm">
                      Every solution.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </Container>
        </div>

        <div
          className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-light"
          id="purpose"
        >
          <Container className="flex flex-col justify-between items-center gap-4 md:gap-8">
            <ScrollReveal>
              <div className="flex flex-col text-center md:gap-3 ">
                <h2 className="text-2xl md:text-3xl font-bold text-oxford">
                  Built on Purpose, Driven by Faith
                </h2>
                <p className="text-base text-gray-2 max-w-[612px]">
                  We don't just build technology. We create solutions that
                  reflect kingdom values and transform communities.
                </p>
              </div>
            </ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between w-full gap-5 lg:gap-8">
              <ScrollReveal delay={0.2} width="100%">
                <div className="bg-none border border-iceblue flex p-8 flex-start flex-col gap-3 flex-1 rounded-3xl shadow-skyblue drop-shadow-xl h-full">
                  <div className="p-4 bg-light w-fit rounded-xl text-xl text-oxford">
                    <LuBrain />
                  </div>
                  <p className="text-xl font-bold text-oxford">AI Innovation</p>
                  <p className="text-base text-oxford tex-thin">
                    Advancing AI research with integrity and purpose
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.4} width="100%">
                <div className="bg-none border border-iceblue flex p-8 flex-start flex-col gap-3 flex-1 rounded-3xl shadow-skyblue drop-shadow-xl h-full">
                  <div className="p-4 bg-light w-fit rounded-xl text-xl text-orange">
                    <PiSpiral />
                  </div>
                  <p className="text-xl font-bold text-oxford">
                    Kingdom Values
                  </p>
                  <p className="text-base text-oxford tex-thin">
                    Building solutions rooted in faith and excellence
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.6} width="100%">
                <div className="bg-none border border-iceblue flex p-8 flex-start flex-col gap-3 flex-1 rounded-3xl shadow-skyblue drop-shadow-xl h-full">
                  <div className="p-4 bg-light w-fit rounded-xl text-xl text-oxford">
                    <RiExchange2Line />
                  </div>
                  <p className="text-xl font-bold text-oxford">
                    Transformation
                  </p>
                  <p className="text-base text-oxford tex-thin">
                    Creating impact that uplifts communities
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </Container>
        </div>

        <div className="flex flex-col bg-iceblue">
          <div
            className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-oxford"
            id="purpose"
          >
            <Container className="flex flex-col justify-between items-center gap-4 md:gap-8">
              <ScrollReveal>
                <div className="bg-iceblue/20 flex justify-center items-center py-1 px-2 lg:py-2 lg:px-4 rounded-full border border-skyblue">
                  <p className="text-sm  text-light">
                    Kingdom-Rooted Innovation
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="flex flex-col text-center md:gap-3 ">
                  <h2 className="text-2xl md:text-3xl font-bold text-iceblue">
                    Three Pillars of Excellence
                  </h2>
                  <p className="text-base text-iceblue max-w-[612px]">
                    From concept to completion, we offer comprehensive solutions
                    rooted in integrity and built for impact.
                  </p>
                </div>
              </ScrollReveal>
            </Container>
          </div>
          <div
            className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-iceblue"
            id="purpose"
          >
            <Container className="flex flex-col justify-between items-center gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-8 w-full">
                <ScrollReveal delay={0.2} width="100%">
                  <motion.div
                    className="bg-white rounded-2xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.05)] overflow-hidden h-full flex flex-col border-2 border-transparent"
                    whileHover={{
                      y: -8,
                      borderColor: "var(--color-skyblue)",
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <CloudinaryImage
                      imageKey="ResearchDesignImage"
                      className="hover:scale-105 transition-transform ease-in-out hover:-rotate-2 w-full h-56 md:h-48 lg:h-56 object-cover"
                      alt="Research & Design"
                    />
                    <div className="p-6 flex flex-col gap-3 grow">
                      <h3 className="text-lg font-bold text-oxford">
                        Design & Build
                      </h3>
                      <p className="text-gray-2 text-sm grow">
                        From concept to deployment, we design and build custom
                        digital solutions. Whether it's a website, mobile app,
                        or enterprise system, we transform your vision into
                        powerful, user-friendly applications that drive results.
                      </p>
                      <Button
                        to="/services/design-build"
                        variant="sec"
                        className="w-fit mt-auto"
                      >
                        <div className="button-content">
                          Learn More
                          <HiArrowLongRight className="arrow" />
                        </div>
                      </Button>
                    </div>
                  </motion.div>
                </ScrollReveal>

                <ScrollReveal delay={0.4} width="100%">
                  <motion.div
                    className="bg-white rounded-2xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.05)] overflow-hidden h-full flex flex-col border-2 border-transparent"
                    whileHover={{
                      y: -8,
                      borderColor: "var(--color-skyblue)",
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <CloudinaryImage
                      imageKey="TrainingImage"
                      className="hover:scale-105 transition-transform ease-in-out hover:-rotate-2 w-full h-56 md:h-48 lg:h-56 object-cover"
                      alt="Tech Training"
                    />
                    <div className="p-6 flex flex-col gap-3 grow">
                      <h3 className="text-lg font-bold text-oxford">
                        Tech Training
                      </h3>
                      <p className="text-gray-2 text-sm grow">
                        Empowering individuals from overlooked spaces to lead
                        with clarity and confidence. We equip educators,
                        leaders, and institutions with tools to integrate
                        technology, innovation, and human-centered design into
                        their work.
                      </p>
                      <Button
                        to="/services/tech-training"
                        variant="sec"
                        className="w-fit mt-auto"
                      >
                        <div className="button-content">
                          Learn More
                          <HiArrowLongRight className="arrow" />
                        </div>
                      </Button>
                    </div>
                  </motion.div>
                </ScrollReveal>

                <ScrollReveal delay={0.6} width="100%">
                  <motion.div
                    className="bg-white rounded-2xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.05)] overflow-hidden h-full flex flex-col border-2 border-transparent"
                    whileHover={{
                      y: -8,
                      borderColor: "var(--color-skyblue)",
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <CloudinaryImage
                      imageKey="PintShop"
                      className="hover:scale-105 transition-transform ease-in-out hover:-rotate-2 w-full h-56 md:h-48 lg:h-56 object-cover"
                      alt="Print Shop"
                    />

                    <div className="p-6 flex flex-col gap-3 grow">
                      <h3 className="text-lg font-bold text-oxford">
                        Print Shop
                      </h3>
                      <p className="text-gray-2 text-sm grow">
                        Premium printing that brings your vision to life with
                        excellence and attention to detail.
                      </p>
                      <Button
                        to="/services/print-shop"
                        variant="sec"
                        className="w-fit mt-auto"
                      >
                        <div className="button-content">
                          Learn More
                          <HiArrowLongRight className="arrow" />
                        </div>
                      </Button>
                    </div>
                  </motion.div>
                </ScrollReveal>
              </div>
            </Container>
          </div>
        </div>
        <Container className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 ">
          <ScrollReveal>
            <div className="flex flex-col text-center md:gap-3 bg-gray-1/30 p-4 md:p-8 lg:p-12 xl:p-16 2xl:p-24 rounded-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-oxford">
                Why Partner with us?
              </h2>
              <p className="text-base text-gray-3 ">
                We bring together the rigor of research, the empathy of design,
                and the power of technology. Every collaboration with us is
                grounded in: Purpose-driven Innovation – We design solutions
                that matter. Inclusive Growth – We build systems that leave no
                learner behind. Sustainable Impact – We measure what we create
                and make it last.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </main>
    </PageTransition>
  );
};

export default Home;
