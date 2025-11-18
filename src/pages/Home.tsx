import CloudinaryImage from "../utils/cloudinaryImage";
import { Link } from "react-router-dom";
import { HiArrowLongRight } from "react-icons/hi2";
import { PiSparkleLight } from "react-icons/pi";

const Home: React.FC = () => {
  return (
    <main className="flex flex-col">
      <div
        className="flex flex-col md:flex-row justify-between items-center px-5 md:px-24 py-12 md:py-36 bg-gradient-to-br from-skyblue/20 to-orange/20"
        id="hero"
      >
        <div className="flex flex-col justify-center items-center md:items-start gap-4 px-5 md:px-24 text-center md:text-start w-full md:w-2/3">
          <div className="bg-iceblue flex justify-center items-center py-2 px-4 rounded-full border border-skyblue gap-4">
            <PiSparkleLight className="text-sm text-skyblue" />
            <p className="text-sm text-oxford">Kingdom-Rooted Innovation</p>
          </div>

          <h1 className="text-4xl md:text-7xl font-black leading-12 md:leading-20 tracking-tighter">
            <span className="text-skyblue">Faith</span>{" "}
            <span className="text-oxford">that builds.</span> <br />
            <span className="text-orange">Impact</span>{" "}
            <span className="text-oxford">that lasts.</span>
          </h1>
          <p className="text-dark">
            {" "}
            We are a kingdom-rooted innovation collective advancing AI through
            thoughtful research, purposeful design, and principled development.
            Transforming lives through technology anchored in faith.
          </p>

          <div className="flex justify-start flex-col md:flex-row gap-3 md:gap-5">
            <Link to="/" className="btn-pry">
              {" "}
              Explore Solutions
            </Link>
            <Link to="/" className="btn-sec">
              <div className="button-content">
                Academy
                <HiArrowLongRight className="arrow" />
              </div>
            </Link>
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
      </div>

      <div
        className="flex flex-col justify-between items-center px-5 md:px-24 py-12 md:py-36 bg-light"
        id="purpose">
          <div className="flex flex-col text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-oxford">
              Built on Purpose, Driven by Faith
            </h2>
            <p className="text-base text-gray-2 max-w-[612px]">We don't just build technology. We create solutions that reflect kingdom values and transform communities.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center">
          </div>
      </div>
    </main>
  );
};

export default Home;
