import React from "react";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { ArrowRightIcon, GraduationCapIcon } from "../../components/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import PageTransition from "../../components/layout/PageTransition";
import ScrollReveal from "../../components/common/ScrollReveal";
import { SEO } from "../../components/common/SEO";
import { getPageSEO } from "../../utils/seo-config";
import {
  generateFAQSchema,
  generateEducationalOrganizationSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";
import Scene3D from "../../components/animations/Scene3D";

const TechTrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const pageSEO = getPageSEO("techTraining");

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
      <main className="flex flex-col">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-linear-to-br from-skyblue/20 to-orange/20">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 flex flex-col gap-6">
              <ScrollReveal>
                <motion.div
                  className="bg-skyblue/20 border border-skyblue rounded-full px-4 py-2 w-fit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="text-sm text-oxford font-medium">
                    TECH TRAINING
                  </p>
                </motion.div>
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
              </ScrollReveal>
            </div>
            <div className="flex-1">
              <ScrollReveal delay={0.8}>
                <div className="overflow-hidden rounded-2xl">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <CloudinaryImage
                      imageKey="TrainingImage"
                      className="rounded-2xl shadow-2xl"
                      alt="Tech Training"
                    />
                  </motion.div>
                </div>
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
              <motion.div
                className="bg-iceblue/30 border-2 border-skyblue rounded-2xl p-8 max-w-2xl mx-auto"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,152,218,0.1)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
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
              </motion.div>
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
                    className="group bg-white border border-gray-200 rounded-xl p-6 h-full cursor-default"
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      borderColor: "var(--color-skyblue)",
                      boxShadow: "0 20px 40px rgba(0,152,218,0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="text-5xl mb-4"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      {course.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-oxford mb-2 group-hover:text-skyblue transition-colors duration-300">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <motion.span
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ⏱️ {course.duration}
                      </motion.span>
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
                  <ArrowRightIcon size={20} />
                </Button>
              </div>
            </ScrollReveal>
          </Container>
        </div>

        {/* Benefits Section */}
        <div className="relative overflow-hidden py-16 md:py-24 bg-oxford text-white">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container className="relative z-10">
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
                    className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center h-full cursor-default"
                    whileHover={{
                      y: -6,
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 20px 40px rgba(0,152,218,0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
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
                  <motion.div
                    className="group text-center relative h-full cursor-default"
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <motion.div
                      className="bg-skyblue text-white text-2xl font-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      whileTap={{ rotate: -10, scale: 0.9 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-oxford group-hover:text-skyblue transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.desc}</p>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-8 -right-4 transform z-10">
                        <ArrowRightIcon size={32} className="text-skyblue" />
                      </div>
                    )}
                  </motion.div>
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
                    className="group bg-white rounded-xl p-6 shadow-md cursor-default"
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,152,218,0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <h3 className="text-lg font-bold text-oxford mb-3 flex items-start gap-2 group-hover:text-skyblue transition-colors duration-300">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        whileTap={{ rotate: -10, scale: 0.9 }}
                      >
                        <GraduationCapIcon size={18} className="text-skyblue mt-1 shrink-0" />
                      </motion.div>
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
            </ScrollReveal>
          </Container>
        </div>
      </main>
    </PageTransition>
  );
};

export default TechTrainingPage;
