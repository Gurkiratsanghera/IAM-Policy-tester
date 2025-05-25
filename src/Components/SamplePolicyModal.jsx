import { useState } from "react";
import { motion } from "framer-motion";
import { samplePolicies } from "../lib/data/sample.policies";

export function SamplePolicyModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  const handleSelectPolicy = (policy) => {
    onSelect(policy.json);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-opacity-50   bg-[#191E2B] flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-[#252D3D] border border-gray-700 text-foreground max-w-2xl w-full rounded-lg shadow-xl overflow-hidden  "
      >
        <div className="border-b border-gray-700 px-6 py-4 flex justify-between  items-center">
          <h3 className="text-lg text-white font-medium">Sample IAM Policies</h3>
          <button 
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-700 flex items-center justify-center" 
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="py-4 px-6 max-h-96 overflow-y-scroll scrollbar-hide ">
          <div className="grid grid-cols-1  gap-4">
            {samplePolicies.map((policy, index) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border border-gray-700 rounded-lg p-4  bg-[#394457] hover:bg-[#4a566b] cursor-pointer transition-colors duration-200"
                onClick={() => handleSelectPolicy(policy)}
              >
                <h4 className="font-medium mb-2 text-white">{policy.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{policy.description}</p>
                <div className="flex justify-end">
                  <button 
                    className="text-xs px-2 py-1 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors duration-200"
                  >
                    Load
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-700 px-6 py-4 flex justify-end">
          <button 
            className="px-4 py-2 bg-[#394457] text-white hover:bg-gray-600 rounded-md text-sm transition-colors duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}