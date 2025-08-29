import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/CoreValue';
import Contact from '../components/Contact';

const Home: React.FC = () => {
  return (
    <div>
       <metadata>
        <title>Gr8QM Technovates | Home </title>
        <meta name="description" content="Gr8QM Home" />
        <meta property="og:title" content="Gr8QM Technovates" />
      </metadata>
      <Hero />
      <Services />
      <About />
      <Contact />
    </div>
  );
};

export default Home;
