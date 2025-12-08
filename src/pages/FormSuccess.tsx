import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiCheckCircle } from "react-icons/hi";
import Button from "../components/common/Button";

const FormSuccess: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();

  return (
    <div className="min-h-screen bg-linear-to-br from-iceblue to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-block mb-6"
        >
          <HiCheckCircle className="w-20 h-20 text-green-500" />
        </motion.div>

        <h1 className="text-3xl font-bold text-oxford mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-8">
          Your response has been submitted successfully. We appreciate you
          taking the time to complete this form.
        </p>

        <div className="space-y-3">
          <Link to="/">
            <Button variant="pry" className="w-full">
              Go to Homepage
            </Button>
          </Link>
          <Link to={`/forms/${shortCode}`}>
            <Button variant="sec" className="w-full">
              Submit Another Response
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Powered by{" "}
            <span className="font-bold text-skyblue">GR8QM Technovates</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default FormSuccess;
