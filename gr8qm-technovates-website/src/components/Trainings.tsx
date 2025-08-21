import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import cld from '../utils/cloudinary';
import { AdvancedImage } from '@cloudinary/react';
import { motion } from 'framer-motion';

interface Training {
  id: number;
  title: string;
  description: string;
  image_public_id: string;
}

const TrainingCard: React.FC<{ training: Training }> = ({ training }) => {
  const image = cld.image(training.image_public_id);
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <AdvancedImage cldImg={image} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">{training.title}</h3>
        <p className="mt-2 text-gray-600">{training.description}</p>
        <div className="mt-4">
          <a href="#" className="text-blue-500 hover:text-blue-600">Learn More</a>
        </div>
      </div>
    </motion.div>
  );
};

const Trainings: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const { data, error } = await supabase.from('trainings').select('*');
        if (error) {
          throw error;
        }
        setTrainings(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Programs</h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
            hidden: {},
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {trainings.map((training) => (
            <motion.div
              key={training.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <TrainingCard training={training} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Trainings;
