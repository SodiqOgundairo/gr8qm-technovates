import React from "react";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { HiArrowLongRight } from "react-icons/hi2";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaGraduationCap } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import PageTransition from "../../components/layout/PageTransition";
import ScrollReveal from "../../components/common/ScrollReveal";

const TechTrainingPage: React.FC = () => {
  const navigate = useNavigate();

  const courses = [
    {
      title: "Product Design",
      description:
        "Master UI/UX design principles and create stunning interfaces",
      icon: "🎨",
      duration: "12 weeks",
      // commitment: "₦50,000",
    },
    {
      title: "Product Management",
      description: "Learn to build and manage successful digital products",
      icon: "📊",
      duration: "10 weeks",
      // commitment: "₦50,000",
    },
    {
      title: "Frontend Development",
      description:
        "Build modern, responsive web applications with React & Next.js",
      icon: "💻",
      duration: "16 weeks",
      // commitment: "₦50,000",
    },
    {
      title: "Backend Development",
      description: "Create robust server-side applications and APIs",
      icon: "⚙️",
      duration: "16 weeks",
      // commitment: "₦50,000",
    },
    {
      title: "DevOps Engineering",
      description: "Master cloud infrastructure and deployment workflows",
      icon: "☁️",
      duration: "14 weeks",
      // commitment: "₦50,000",
    },
    {
      title: "Cybersecurity",
      description: "Protect systems and data from digital threats",
      icon: "🔒",
      duration: "12 weeks",
      // commitment: "₦50,000",
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

  return (
    <PageTransition>
      <main className="flex flex-col">
        {/* Hero Section */}
        <div className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-linear-to-br from-skyblue/20 to-orange/20">
          <Container className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 flex flex-col gap-6">
              <ScrollReveal>
                <div className="bg-skyblue/20 border border-skyblue rounded-full px-4 py-2 w-fit">
                  <p className="text-sm text-oxford font-medium">
                    TECH TRAINING
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="text-oxford">Launch Your Tech Career,</span>{" "}
                  <span className="text-skyblue">Sponsored</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Master in-demand tech skills with our specialized training
                  programs. Learn from industry experts, build real projects,
                  and start your journey to a rewarding tech career. Only a
                  small commitment fee required.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.6}>
                <div className="flex gap-4 flex-wrap">
                  <Button variant="pry" onClick={() => navigate("/trainings")}>
                    Browse Courses
                    <IoIosArrowRoundForward className="text-2xl" />
                  </Button>
                  <Button
                    variant="sec"
                    onClick={() =>
                      navigate("/portfolio?category=tech-training")
                    }
                  >
                    <div className="button-content">
                      Student Success Stories
                      <HiArrowLongRight className="arrow" />
                    </div>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
            <div className="flex-1">
              <ScrollReveal delay={0.8}>
                <CloudinaryImage
                  imageKey="TrainingImage"
                  className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                  alt="Tech Training"
                />
              </ScrollReveal>
            </div>
          </Container>
        </div>

        {/* Why FREE? Section */}
        <div className="py-16 md:py-24 bg-white">
          <Container>
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-oxford">
                  Launch Your Tech Career with <br />
                  <span className="text-skyblue">Sponsored Training</span>
                </h2>
                <p className="text-base text-gray-2 max-w-[612px]">
                  We believe financial barriers shouldn't stop talent. Start
                  your journey to a rewarding tech career. Only a small
                  commitment fee required.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="bg-iceblue/30 border-2 border-skyblue rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">💡</div>
                  <div>
                    <h3 className="text-xl font-bold text-oxford mb-2">
                      Commitment Fee Policy
                    </h3>
                    <p className="text-gray-700">
                      Pay a one-time commitment fee when you enroll. This
                      secures your spot and ensures serious participation in the
                      cohort. It's that simple.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </Container>
        </div>

        {/* Available Courses Section */}
        <div className="py-16 md:py-24 bg-light">
          <Container>
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
                  Available Courses
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Choose from our range of industry-leading tech programs
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <ScrollReveal key={index} delay={index * 0.1} width="100%">
                  <motion.div
                    className="bg-white border border-gray-200 rounded-xl p-6 h-full"
                    whileHover={{
                      y: -8,
                      borderColor: "var(--color-skyblue)",
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-5xl mb-4">{course.icon}</div>
                    <h3 className="text-xl font-bold text-oxford mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        ⏱️ {course.duration}
                      </span>
                      {/* <span className="font-semibold text-skyblue">
                        {course.commitment}
                      </span> */}
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={0.4}>
              <div className="text-center mt-8">
                <Button variant="pry" onClick={() => navigate("/trainings")}>
                  View All Courses & Apply
                  <IoIosArrowRoundForward className="text-2xl" />
                </Button>
              </div>
            </ScrollReveal>
          </Container>
        </div>

        {/* Benefits Section */}
        <div className="py-16 md:py-24 bg-oxford text-white">
          <Container>
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Why Choose <span className="text-iceblue">Gr8QM</span>{" "}
                  Training?
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  More than just courses—a complete career transformation
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} delay={index * 0.2} width="100%">
                  <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center h-full"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-5xl mb-4">{benefit.icon}</div>
                    <h3 className="text-lg font-bold mb-3 text-iceblue">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {benefit.description}
                    </p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>

        {/* How It Works Section */}
        <div className="py-16 md:py-24 bg-white">
          <Container>
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
                  How It Works
                </h2>
              </div>
            </ScrollReveal>
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
                <ScrollReveal key={index} delay={index * 0.2} width="100%">
                  <div className="text-center relative h-full">
                    <div className="bg-skyblue text-white text-2xl font-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-oxford">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.desc}</p>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-8 -right-4 transform z-10">
                        <IoIosArrowRoundForward className="text-4xl text-skyblue" />
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>

        {/* FAQs Section */}
        <div className="py-16 md:py-24 bg-light">
          <Container>
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
                  Frequently Asked Questions
                </h2>
              </div>
            </ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <ScrollReveal key={index} delay={index * 0.1} width="100%">
                  <motion.div
                    className="bg-white rounded-xl p-6 shadow-md"
                    whileHover={{
                      scale: 1.02,
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-oxford mb-3 flex items-start gap-2">
                      <FaGraduationCap className="text-skyblue mt-1 shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 pl-7">{faq.answer}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </div>

        {/* CTA Section */}
        <div className="py-16 md:py-24 bg-linear-to-r from-skyblue to-iceblue">
          <Container className="text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of students who have launched successful tech
                careers through our specialized training programs.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  variant="inverted"
                  onClick={() => navigate("/trainings")}
                >
                  Browse Courses
                  <IoIosArrowRoundForward className="text-2xl" />
                </Button>
                <Button
                  variant="sec"
                  onClick={() => navigate("/portfolio?category=tech-training")}
                >
                  See Student Work
                  <HiArrowLongRight className="arrow" />
                </Button>
              </div>
            </ScrollReveal>
          </Container>
        </div>
      </main>
    </PageTransition>
  );
};

export default TechTrainingPage;
