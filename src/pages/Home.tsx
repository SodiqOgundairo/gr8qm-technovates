import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/CoreValue';
import Contact from '../components/Contact';
import SEO from '../components/common/SEO';

const Home: React.FC = () => {
  return (
    <div>
      <SEO
        title="Home"
        description="Welcome to Gr8QM Technovates. We design, build, and deliver AI powered solutions, product design, and training that raise leaders from overlooked spaces."
      />
      <Hero />
      <Services />
      <About />
      <Contact />
    </div>
  );
};

export default Home;
