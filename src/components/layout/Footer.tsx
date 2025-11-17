import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import CloudinaryImage from "../../utils/cloudinaryImage";
import shape1 from '../../assets/img/shape.png'
import shape2 from '../../assets/img/shape2.png'
import arrow from '../../assets/img/arrow_corner.svg'
import { LiaFacebookF, LiaInstagram, LiaLinkedin } from "react-icons/lia";
import { RiTwitterXFill } from "react-icons/ri";

const currentYear = new Date().getFullYear()

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-oxford text-white p-5 md:px-24 md:py-36 flex flex-col gap-24 items-start">
      <div className="flex flex-col md:flex-row justify-between gap-6">

      <div
        id="subscribe"
        className="bg-skyblue/20 border border-skyblue rounded-lg flex p-6 flex-col justify-between items-start md:w-[35%] gap-12 z-20"
        >
        <div className="flex flex-col gap-4">
          <p className="text-orange text-xs md:text-sm"> LET'S GO</p>
          <h2 className=" text-2xl md:text-3xl text-gray-1 font-light">
            Seeking personalized support?
            <span className="text-light font-medium"> Request a call from our team</span>
          </h2>
        </div>

        <div className="flex flex-col gap-4 md:gap-2 w-full">
          <div className="flex flex-col md:flex-row justify-start gap-4 md:gap-2">
            {/* <label htmlFor="name">Name</label> */}
            <input type="text" className="input-field" placeholder="name" name="name" required/>
            <input type="email" className="input-field" placeholder="email" name="email" required/>
          </div>
          <button className="btn-inverted flex justify-center items-center">Send a request <IoIosArrowRoundForward /> </button>
        </div>
        </div>

      <div
        id="links"
        className="flex flex-col justify-between items-start md:w-[40%] my-8 md:my-0 z-20"
        >
          <div className="flex justify-between flex-row w-full">

        <div className="flex flex-col gap-4">
          <p className="text-orange text-sm"> SERVICES</p>
            <ul className="list-none text-light space-y-2">
              <li> <Link to='/' className="font-light" > Service Design</Link> </li>
              <li> <Link to='/' className="font-light" > Tech Training</Link> </li>
              <li> <Link to='/' className="font-light" > Print Shop</Link> </li>
            </ul>
          </div>
        <div className="flex flex-col gap-4">
          <p className="text-orange text-sm"> INFORMATION</p>
            <ul className="list-none text-light space-y-2">
              <li> <Link to='/' className="font-light" > About Us</Link> </li>
              <li> <Link to='/' className="font-light" > Our Mission</Link> </li>
              <li> <Link to='/' className="font-light" > Our Work</Link> </li>
            </ul>
          </div>
          </div>

        <div className="flex flex-col gap-4 mt-14 md:my-0">
          <p className="text-orange text-sm"> CONTACT US</p>
          <a href="mailto:hellow@gr8qm.com" className="font-light"> hellow@gr8qm.com</a>
          <a href="tel:+2349013294248" className="font-light"> +234 901 329 4248</a>
          </div>
        </div>

      <div
        id="logo"
        className="flex flex-col justify-between md:items-end md:w-[15%] z-20"
        >
          <Link to="/" aria-label="Homepage">
            <CloudinaryImage
              imageKey="verticalLogo"
              className=" hover:scale-105 transition-transform ease-in-out hover:-rotate-2 w-2/5 md:w-full"
              alt="Gr8QM Logo"
            />
          </Link>
          <p className="text-sm italic text-light">
            Innovating with faith, designing with purpose, and transforming lives through kingdom-rooted technology.
          </p>
        </div>
      <div className="absolute inset-0">
        <img src={shape1} alt="footer image" className="absolute top-[50%] left-2.5" />
        <img src={shape2} alt="footer image" className="absolute right-0 bottom-0"/>
      </div>
      </div>

        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6 z-20 py-5 px-4 bg-dark/20 rounded-b-md">
          <div className="flex">
        <img src={arrow} alt="footer image" className="" />
        <p className="text-sm">

        &copy; {currentYear} - Copyright - <span className="text-iceblue"> Gr8QM</span>
        </p>
          </div>

          <div className="flex justify-between gap-8 text-white text-2xl ">
        <a href="https://www.linkedin.com/company/gr8qm" target="_blank">
         <LiaLinkedin />
        </a>
        <a href="https://www.instagram.com/gr8qmtechnovate" target="_blank">
         <LiaInstagram />
        </a>
        <a href="https://www.x.com/gr8qmtechnovate" target="_blank">
         <RiTwitterXFill />
        </a>
        <a href="https://web.facebook.com/profile.php?id=61559404115455&sk=about" target="_blank">
         <LiaFacebookF />
        </a>
          </div>

        </div>

    </footer>
  );
};

export default Footer;
