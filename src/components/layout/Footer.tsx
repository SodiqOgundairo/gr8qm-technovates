
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center mb-4">
          <a href="https://facebook.com/designuonline" className="mx-3 hover:text-blue-400">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com/designuonline" className="mx-3 hover:text-blue-400">
            <FaTwitter size={24} />
          </a>
          <a href="https://linkedin.com/company/designuonline" className="mx-3 hover:text-blue-400">
            <FaLinkedin size={24} />
          </a>
          <a href="https://instagram.com/designuonline" className="mx-3 hover:text-blue-400">
            <FaInstagram size={24} />
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Gr8QM Technovates. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
