
import cld from '../utils/cloudinaryBank';
import { AdvancedImage } from '@cloudinary/react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const aboutImage = cld.image('Gr8QMTechnovates/image_1_a25x7u');

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 md:flex md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2"
        >
          <AdvancedImage cldImg={aboutImage} className="rounded-lg shadow-lg" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 md:pl-12 mt-8 md:mt-0"
        >
          <h2 className="text-3xl font-bold text-gray-800">We dont just design a service. <br /> We design a movement</h2>
          <p className="mt-4 text-gray-600">
            DesignU improves the economic outcomes of individuals by equipping them with premium technology skills, business skills and life skills.
          </p>
          <div className="mt-8">
            <a href="/about-us" className="bg-blue-500 text-white rounded-md px-6 py-3 hover:bg-blue-600">
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
