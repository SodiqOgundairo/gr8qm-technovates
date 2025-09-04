import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import cld from '../utils/cloudinaryBank';
import { AdvancedImage } from '@cloudinary/react';
import { motion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

interface Service {
  id: number;
  title: string;
  description: string;
  image_public_id: string;
  button: string;
  btn_url: string;
}

const ServiceCard: React.FC<{ Service: Service }> = ({ Service }) => {
  const image = cld.image(Service.image_public_id);
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <AdvancedImage cldImg={image} className="w-full object-fit h-48 object-top object-cover px-8" />
      <div className="p-6">
        <h3 className="text-xl font-bold text-oxfordblue">{Service.title}</h3>
        <p className="mt-2 text-gray">{Service.description}</p>
        <div className="mt-4">
          <Link to={Service.btn_url} className="btn-sec">
            <span className="button-content">
              {Service.button} <HiArrowLongRight className='arrow' />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const [Services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from('services').select('*');
        if (error) {
          throw error;
        }
        setServices(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="bg-gray1 py-40">
      <div className="container mx-auto px-6">
        <div className="flex justify-center flex-col items-center">

        <h2 className="text-3xl font-bold text-center text-oxfordblue mb-12 font-body leading-0">What Makes Us Different</h2>
        <p className="text-sm text-gray italic">Our heartbeat in three sentences.</p>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
            hidden: {},
          }}
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {Services.map((Service) => (
            <motion.div
              key={Service.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ServiceCard Service={Service} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
