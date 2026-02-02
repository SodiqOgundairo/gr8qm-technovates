import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { HiCheckCircle, HiArrowLeft } from "react-icons/hi";
import { motion } from "framer-motion";

const FormSuccess: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white py-12 px-6 shadow-xl rounded-2xl sm:px-10 text-center relative overflow-hidden"
        >
          {/* Confetti or decorative background could go here */}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6"
          >
            <HiCheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Submission Received!
          </h2>

          <p className="text-gray-600 mb-8 text-lg">
            Thank you for filling out the form. Your response has been recorded
            successfully.
          </p>

          <Link
            to={shortCode ? `/forms/${shortCode}` : "/"}
            className="inline-flex items-center text-skyblue hover:text-oxford font-semibold transition-colors"
          >
            <HiArrowLeft className="mr-2" />
            Back to Form
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FormSuccess;
