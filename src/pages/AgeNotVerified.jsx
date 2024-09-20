import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AgeNotVerified = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reason, similarity_percentage } = location.state || {};
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (reason === 'face_mismatch') {
      setMessage(`The face on the ID does not match the captured image. (Similarity: ${similarity_percentage.toFixed(2)}%)`);
    } else if (reason === 'underage') {
      setMessage("You must be 18 or older to proceed.");
    } else {
      setMessage("Sorry, the identification process wasn't successful. Please try again.");
    }
  }, [reason, similarity_percentage]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-red-100 dark:bg-red-900"
    >
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">Age Not Verified</h1>
        <p className="text-xl mb-6 dark:text-gray-300">{message}</p>
        <Button onClick={() => navigate('/age-verification')} className="mr-4">
          Try Again
        </Button>
        <Button onClick={() => navigate('/')} variant="outline">
          Close
        </Button>
      </div>
    </motion.div>
  );
};

export default AgeNotVerified;