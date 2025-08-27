import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/CoreValue';
import Contact from '../components/Contact';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <Services />
      <About />
      <Contact />
    </div>
  );
};

export default Home;
