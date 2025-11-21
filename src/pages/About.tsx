import Container from "../components/layout/Container";
import CloudinaryImage from "../utils/cloudinaryImage";
import Button from "../components/common/Button";
import Card from "../components/layout/Card";
import { PiSparkleLight, PiSpiral } from "react-icons/pi";
import { IoIosHeartEmpty, IoIosTrendingUp } from "react-icons/io";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import { SlBadge } from "react-icons/sl";
import { LuShield } from "react-icons/lu";

const AboutPage: React.FC = () => {
  return (
    <main className="flex flex-col">
      <div className="py-12 md:py-20 lg:py-28 xl:py-32 2xl:py-40 bg-gradient-to-br from-skyblue/20 to-orange/20">
        <Container className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 text-center md:text-left w-full md:w-1/2">
            <div className="bg-skyblue rounded-2xl  p-4 py-8 md:p-5 lg:p-16 xl:p-16 2xl:p-24 space-y-4">
              <div className="bg-iceblue/40 border border-skyblue rounded-full px-4 py-2 w-fit mx-auto md:mx-0">
                <p className="text-sm text-oxford">About Us</p>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight wrap-break-word">
                <span className="text-iceblue">A kingdom-rooted</span>{" "}
                <span className="text-iceblue">Innovation</span>{" "}
                <span className="text-oxford">Collective</span>
              </h1>
            </div>
            <div className="bg-orange p-2 py-4 md:p-5 lg:p-16 xl:p-16 2xl:p-24 rounded-2xl">
              <p className="text-light md:text-sm lg:text-base max-w-[650px] mx-auto md:mx-0">
                We exist to research, design, and develop impactful AI
                technologies while equipping individuals through transformative
                training. Our mission is to build with excellence, serve with
                integrity, and create tech that reflects our faith-driven
                purpose.
              </p>
            </div>
          </div>
          {/* <div className="w-full"> */}
          <CloudinaryImage
            imageKey="aboutUsHero"
            className="object-cover md:w-1/2 max--[600px]"
            alt="About Us Hero"
          />
          {/* </div> */}
        </Container>
      </div>

      <div id="mission" className="py-16 md:py-24 lg:py-32 bg-light">
        <Container className="flex flex-col lg:flex-row justify-center gap-10 items-center">
          <CloudinaryImage
            imageKey="visionMision"
            className=" hover:scale-105 transition-transform ease-in-out hover:-rotate-2 w-full lg:scale-105"
            alt="Hero BG"
          />
          <div className="flex flex-col items-start gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-oxford flex justify-start items-start gap-4">
                <PiSpiral className="text-skyblue" />
                Our Vision
              </h2>
              <p className="text-gray-2">
                We lead innovation in research, purposeful design, and
                development, building solutions with integrity and impact. We
                envision communities thriving as technology aligns with faith
                and purpose.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-oxford flex justify-start items-start gap-4">
                <PiSparkleLight className="text-orange" />
                Our Mission
              </h2>
              <p className="text-gray-2">
                We equip individuals and institutions with tools to integrate
                technology, innovation, and human-centered design into their
                work while advancing principled development.
              </p>
            </div>
            <div className="bg-iceblue p-2 md:p-4 rounded-full">
              <p className="text-basee font-bold italic text-oxford">
                "Innovating with faith, designing with purpose, and transforming
                lives."
              </p>
            </div>
          </div>
        </Container>
      </div>

      <div className="py-16 md:py-24 lg:py-32 bg-iceblue">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-light w-fit m-auto py-2 px-4 rounded-full">
              <p className="text-sm text-skyblue">Kingdom-Rooted Innovation</p>
            </div>
            <div className="flex-col flex gap-2 w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-oxford text-center">
                Our Core Values
              </h2>
              <p className="text-base text-dark text-center md:text-sm lg:text-base ">
                The principles that guide every decision, design, and line of
                code we create.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-skyblue bg-light rounded-xl gap-3 px-4 py-8 md:px-5 md:py-8 lg:px-8 lg:py-10 flex flex-col items-start drop-shadow-2xs">
              <div className="rounded-lg p-2 bg-skyblue/20">
                <IoIosHeartEmpty className="text-2xl text-skyblue " />
              </div>
              <p className="text-oxford font-bold">Kingdom-Rooted</p>
              <p className="text-gray-3">
                We anchor every effort in faith, purpose, and values that
                transform lives.
              </p>
            </Card>
            <Card className="border border-skyblue bg-light rounded-xl gap-3 px-4 py-8 md:px-5 md:py-8 lg:px-8 lg:py-10 flex flex-col items-start drop-shadow-2xs">
              <div className="rounded-lg p-2 bg-orange/20">
                <HiOutlineLightBulb className="text-2xl text-orange " />
              </div>
              <p className="text-oxford font-bold">Innovation with Purpose</p>
              <p className="text-gray-3">
                We design and build solutions that solve real problems with
                clarity and compassion.
              </p>
            </Card>
            <Card className="border border-skyblue bg-light rounded-xl gap-3 px-4 py-8 md:px-5 md:py-8 lg:px-8 lg:py-10 flex flex-col items-start drop-shadow-2xs">
              <div className="rounded-lg p-2 bg-skyblue/20">
                <FiUser className="text-2xl text-skyblue " />
              </div>
              <p className="text-oxford font-bold">Empowerment</p>
              <p className="text-gray-3">
                We elevate overlooked communities with tools and training to
                lead confidently.
              </p>
            </Card>
            <Card className="border border-skyblue bg-light rounded-xl gap-3 px-4 py-8 md:px-5 md:py-8 lg:px-8 lg:py-10 flex flex-col items-start drop-shadow-2xs">
              <div className="rounded-lg p-2 bg-oxford/20">
                <SlBadge className="text-2xl text-oxford " />
              </div>
              <p className="text-oxford font-bold">Excellence First</p>
              <p className="text-gray-3">
                We set uncompromising standards in design, research, and
                engineering.
              </p>
            </Card>
            <Card className="border border-skyblue bg-light rounded-xl gap-3 px-4 py-8 md:px-5 md:py-8 lg:px-8 lg:py-10 flex flex-col items-start drop-shadow-2xs">
              <div className="rounded-lg p-2 bg-orange/20">
                <IoIosTrendingUp className="text-2xl text-orange " />
              </div>
              <p className="text-oxford font-bold">Transformation</p>
              <p className="text-gray-2">
                We build products and services that enable lasting impact
                through technology.
              </p>
            </Card>
            <Card className="border border-skyblue bg-light rounded-xl gap-3 px-4 py-8 md:px-5 md:py-8 lg:px-8 lg:py-10 flex flex-col items-start drop-shadow-2xs">
              <div className="rounded-lg p-2 bg-oxford/20">
                <LuShield className="text-2xl text-oxford " />
              </div>
              <p className="text-oxford font-bold">Integrity & Service</p>
              <p className="text-gray-2">
                We act with honesty, serve with humility, and prioritize people
                over process.
              </p>
            </Card>
          </div>
        </Container>
      </div>

      <div className="py-16 md:py-24 lg:py-32 bg-light">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-oxford">
            What makes us different
          </h3>
          <p className="text-gray-2 max-w-3xl">
            Gr8QM Technovates is a kingdom-rooted innovation collective. We
            advance AI through purposeful research, principled development, and
            human-centered design. We build solutions that transform communities
            and empower institutions while staying grounded in faith.
          </p>
          <Button to="/contact" variant="pry">
            Start your project today
          </Button>
        </Container>
      </div>
    </main>
  );
};

export default AboutPage;
