
import SEO from '../components/common/SEO';

const TrainingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20">
      <SEO
        title="Trainings"
        description="Explore our comprehensive, hands-on training programs designed to align with the latest industry trends and help you specialize in your area of interest."
      />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Trainings</h1>
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
        </div>
        <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0">
          <p className="text-gray-600 mb-4">
            Our training programs are designed to be comprehensive, hands-on, and aligned with the latest industry trends. We offer a variety of courses to help you specialize in your area of interest.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Frontend Development</li>
            <li>Backend Development</li>
            <li>Full-Stack Development</li>
            <li>UI/UX Design</li>
            <li>Data Science</li>
            <li>DevOps</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrainingsPage;
