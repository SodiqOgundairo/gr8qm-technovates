
const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">About Us</h1>
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
        </div>
        <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0">
          <p className="text-gray-600 mb-4">
            Welcome to Gr8QM Technovates, where we are passionate about empowering the next generation of tech professionals. Our mission is to provide world-class training and education to help you launch and advance your career in the ever-evolving technology industry.
          </p>
          <p className="text-gray-600">
            Our team of experienced instructors and mentors are dedicated to providing you with the skills and knowledge you need to succeed. We offer a wide range of courses and programs designed to meet the demands of today's job market.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
