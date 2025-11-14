import { motion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
// import { cloudinaryImages } from '../utils/cloudinaryBank';

const Hero = () => {
  // const heroImageURL = cloudinaryImages.verticalLogo.toURL();

  return (
    <motion.div
      className="relative h-screen bg-cover bg-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-light/50 to-skyblue/20"></div>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >

          <p className="rounded-full bg-iceblue/40 border-2 border-skyblue py-2 px-10 mx-auto max-w-fit my-6"> Tech with purpose</p>
          <h1 className="text-header drop-shadow-2xl">            
            {/* Tech with <span className="text-skyblue">  purpose. </span><br /> */}
             <span className="text-orange">Faith</span> that builds. <br /><span className="text-skyblue">Impact </span> that lasts.</h1>
          <p className="text-lg md:text-xl mt-6 md:max-w-2xl">We are a research, design, and development company creating products, services, and learning pathways for people who want to build a better world.</p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4"
          >
            <a href="/tech-school" className="btn-pry">
             

                Explore Solutions 
            </a>

            <a href="/designu-online" className="btn-sec">
              <span className="button-content">

                Enter the DSGN LAB <HiArrowLongRight className='arrow' />
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
