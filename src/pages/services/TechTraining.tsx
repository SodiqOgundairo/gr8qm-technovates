import React from "react";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import CloudinaryImage from "../../utils/cloudinaryImage";
import { HiArrowLongRight } from "react-icons/hi2";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaGraduationCap } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TechTrainingPage: React.FC = () => {
  const navigate = useNavigate();

  const courses = [
    {
      title: "Product Design",
      description:
        "Master UI/UX design principles and create stunning interfaces",
      icon: "🎨",
      duration: "12 weeks",
      commitment: "₦50,000",
    },
    {
      title: "Product Management",
      description: "Learn to build and manage successful digital products",
      icon: "📊",
      duration: "10 weeks",
      commitment: "₦50,000",
    },
    {
      title: "Frontend Development",
      description:
        "Build modern, responsive web applications with React & Next.js",
      icon: "💻",
      duration: "16 weeks",
      commitment: "₦50,000",
    },
    {
      title: "Backend Development",
      description: "Create robust server-side applications and APIs",
      icon: "⚙️",
      duration: "16 weeks",
      commitment: "₦50,000",
    },
    {
      title: "DevOps Engineering",
      description: "Master cloud infrastructure and deployment workflows",
      icon: "☁️",
      duration: "14 weeks",
      commitment: "₦50,000",
    },
    {
      title: "Cybersecurity",
      description: "Protect systems and data from digital threats",
      icon: "🔒",
      duration: "12 weeks",
      commitment: "₦50,000",
    },
  ];

  const benefits = [
    {
      icon: "🎓",
      title: "100% FREE Training",
      description:
        "World-class education at no cost. You only pay a refundable commitment fee.",
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
      question: "Is the training really FREE?",
      answer:
        "Yes! The training is 100% FREE. The commitment fee is refundable upon course completion and ensures serious learners.",
    },
    {
      question: "What is the commitment fee for?",
      answer:
        "The commitment fee demonstrates your dedication. It's fully refundable when you complete the course and attend at least 80% of classes.",
    },
    {
      question: "What if I miss classes?",
      answer:
        "All sessions are recorded, so you can catch up. However, you must maintain at least 80% attendance to qualify for the refund.",
    },
    {
      question: "Do I need prior experience?",
      answer:
        "Most courses are beginner-friendly, though some may have prerequisites. Check individual course details for requirements.",
    },
  ];

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <div className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-gradient-to-br from-skyblue/20 to-orange/20">
        <Container className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-skyblue/20 border border-skyblue rounded-full px-4 py-2 w-fit">
              <p className="text-sm text-oxford font-medium">TECH TRAINING</p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
              <span className="text-oxford">Launch Your Tech Career,</span>{" "}
              <span className="text-skyblue">100% FREE</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Master in-demand tech skills with our FREE training programs.
              Learn from industry experts, build real projects, and start your
              journey to a rewarding tech career. Only a refundable commitment
              fee required.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button variant="pry" onClick={() => navigate("/trainings")}>
                Browse Courses
                <IoIosArrowRoundForward className="text-2xl" />
              </Button>
              <Button
                variant="sec"
                onClick={() => navigate("/portfolio?category=tech-training")}
              >
                <div className="button-content">
                  Student Success Stories
                  <HiArrowLongRight className="arrow" />
                </div>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <CloudinaryImage
              imageKey="TrainingImage"
              className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
              alt="Tech Training"
            />
          </div>
        </Container>
      </div>

      {/* Why FREE? Section */}
      <div className="py-16 md:py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-6">
              Why Is This <span className="text-skyblue">FREE</span>?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We believe talent exists everywhere, but opportunity doesn't. Our
              mission is to equip individuals from overlooked spaces with
              world-class tech skills. The commitment fee ensures serious
              learners while keeping education accessible to all. Complete the
              course, and your fee is fully refunded.
            </p>
          </div>
          <div className="bg-iceblue/30 border-2 border-skyblue rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="text-5xl">💡</div>
              <div>
                <h3 className="text-xl font-bold text-oxford mb-2">
                  Commitment Fee Policy
                </h3>
                <p className="text-gray-700">
                  Pay a one-time commitment fee when you enroll. Attend at least
                  80% of classes and complete the course to get it back. It's
                  that simple.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Available Courses Section */}
      <div className="py-16 md:py-24 bg-light">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
              Available Courses
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose from our range of industry-leading tech programs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-skyblue hover:shadow-lg transition-all duration-300"
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
                  <span className="font-semibold text-skyblue">
                    {course.commitment}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="pry" onClick={() => navigate("/trainings")}>
              View All Courses & Apply
              <IoIosArrowRoundForward className="text-2xl" />
            </Button>
          </div>
        </Container>
      </div>

      {/* Benefits Section */}
      <div className="py-16 md:py-24 bg-oxford text-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-iceblue">Gr8QM</span> Training?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              More than just courses—a complete career transformation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold mb-3 text-iceblue">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* How It Works Section */}
      <div className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
              How It Works
            </h2>
          </div>
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
                desc: "Fill the application form and pay the refundable commitment fee",
              },
              {
                step: "3",
                title: "Learn & Build",
                desc: "Attend classes, work on projects, and gain real skills",
              },
              {
                step: "4",
                title: "Graduate & Succeed",
                desc: "Complete the course, get your refund, and land your dream job",
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-skyblue text-white text-2xl font-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-oxford">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 transform">
                    <IoIosArrowRoundForward className="text-4xl text-skyblue" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* FAQs Section */}
      <div className="py-16 md:py-24 bg-light">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-oxford mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-bold text-oxford mb-3 flex items-start gap-2">
                  <FaGraduationCap className="text-skyblue mt-1 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-24 bg-gradient-to-r from-skyblue to-iceblue">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of students who have launched successful tech careers
            through our FREE training programs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="inverted" onClick={() => navigate("/trainings")}>
              Browse Courses
              <IoIosArrowRoundForward className="text-2xl" />
            </Button>
            <Button
              variant="sec"
              onClick={() => navigate("/portfolio?category=tech-training")}
              className="bg-white text-oxford hover:bg-gray-100"
            >
              <div className="button-content">
                See Student Work
                <HiArrowLongRight className="arrow" />
              </div>
            </Button>
          </div>
        </Container>
      </div>
    </main>
  );
};

export default TechTrainingPage;
