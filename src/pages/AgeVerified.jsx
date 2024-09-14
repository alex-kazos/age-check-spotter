import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AgeVerified = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-green-100"
    >
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-sm mx-auto">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Age Verified</h1>
        <p className="text-xl mb-6">Your age has been verified. You can proceed with your order.</p>
        <Button onClick={() => navigate('/continue-order')} className="mr-4">
          Continue Order
        </Button>
        <Button onClick={() => navigate('/')} variant="outline">
          Close
        </Button>
      </div>
    </motion.div>
  );
};

export default AgeVerified;
