import CloudinaryImage from "../utils/cloudinaryImage";
import { Link } from "react-router-dom";
import { HiArrowLongRight } from "react-icons/hi2";
import { PiSparkleLight } from "react-icons/pi";
import Purpose from "../components/Purpose";
import Container from "../components/common/Container";

const Home: React.FC = () => {
  return (
    <main className="flex flex-col">
      <div
        className="bg-gradient-to-br from-skyblue/20 to-orange/20"
        id="hero"
      >
        <Container
          maxWidth="2xl"
          padding="py-12 md:py-36"
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="flex flex-col justify-center items-center md:items-start gap-4 text-center md:text-start w-full md:w-2/3">
            <div className="bg-iceblue flex justify-center items-center py-2 px-4 rounded-full border border-skyblue gap-4">
              <PiSparkleLight className="text-body-sm text-skyblue" />
              <p className="text-body-sm text-oxford">
                Kingdom-Rooted Innovation
              </p>
            </div>

          <h1 className="text-header-2 md:text-header-1">
            <span className="text-skyblue">Faith</span>{" "}
            <span className="text-oxford">that builds.</span> <br />
            <span className="text-orange">Impact</span>{" "}
            <span className="text-oxford">that lasts.</span>
          </h1>
          <p className="text-body-md text-dark">
            {" "}
            We are a kingdom-rooted innovation collective advancing AI through
            thoughtful research, purposeful design, and principled development.
            Transforming lives through technology anchored in faith.
          </p>

          <div className="flex justify-start flex-col md:flex-row gap-3 md:gap-5">
            <Button to="/" variant="pry">
              Explore Solutions
            </Button>
            <Button to="/" variant="sec">
              <div className="button-content">
                Academy
                <HiArrowLongRight className="arrow" />
              </div>
            </Button>
          </div>
        </div>

        <div className="flex flex-col relative">
          <CloudinaryImage
            imageKey="heroBg"
            className=" hover:scale-105 transition-transform ease-in-out hover:-rotate-2 w-full md:scale-105"
            alt="Hero BG"
          />

          <div className="flex items-center absolute -left-10 bottom-4 rounded-lg bg-white shadow-sm shadow-iceblue p-5 gap-4 hover:scale-110 hover:rotate-12">
            <div className="p-2 bg-iceblue rounded-md">
            <PiSparkleLight className="text-2xl text-skyblue" />
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-oxford">Excellence in</p>
              <p className="font-light text-gray-2 text-sm">Every solution.</p>
            </div>
          </div>
        </div>
        </Container>
      </div>

      <Purpose />
    </main>
  );
};

export default Home;
