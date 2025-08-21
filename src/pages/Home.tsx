import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Trainings from '../components/Trainings';
import Contact from '../components/Contact';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <About />
      <Trainings />
      <Contact />
    </div>
  );
};

export default Home;
