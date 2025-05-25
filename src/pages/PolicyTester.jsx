import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EditorPanel } from "../components/EditorPanel";
import { VisualizationPanel } from "../components/VisualizationPanel";
import { SamplePolicyModal } from "../components/SamplePolicyModal";
import {FlipWords} from "../Components/FlipWords"
import { 
  validatePolicy, 
  generatePolicySummary, 
  highlightJSON
} from "../lib/utils/policy-utils";

const DEFAULT_POLICY = `{
  "Version": "2025-05-24",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
      ],
      "Resource": []
    }
  ]
}`;

export default function PolicyTester() {
  const [policyJson, setPolicyJson] = useState(DEFAULT_POLICY);
  const [highlightedJson, setHighlightedJson] = useState("");
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [policySummary, setPolicySummary] = useState(null);

  useEffect(() => {
    // Update the highlighted JSON when policy changes
    setHighlightedJson(highlightJSON(policyJson));
  }, [policyJson]);

  const handleValidate = () => {
    const result = validatePolicy(policyJson);
    setValidationStatus(result);
    
    if (result.valid) {
      const summary = generatePolicySummary(policyJson);
      setPolicySummary(summary);
    }
  };
  const words=["Gurkirat","Karan","Harjeet","Karanveer"];

  const handleClear = () => {
    setPolicyJson("{\n  \n}");
    setValidationStatus(null);
    setPolicySummary(null);
  };

  const handlePolicyChange = (newPolicy) => {
    setPolicyJson(newPolicy);
  };

  useEffect(() => {
    // Validate the default policy on initial load
    handleValidate();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#191E2B] ">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-700 bg-[#252D3D] py-4 px-6 flex justify-between items-center shadow-md"
      >
        <div className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="text-primary h-6 w-6 text-[#739FF2]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" 
            />
          </svg>
          <h1 className="text-2xl font-semibold  text-white">IAM Policy Tester & Visualizer <div className="text-[#cfd1d6] font-semibold text-xs mt-1 ">BY-<FlipWords className="text-[#cfd1d6] font-semibold  text-xs " words={words} /> </div></h1>
          
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="text-sm px-3 py-1.5 rounded-md bg-surface-lighter text-white hover:bg-gray-600 bg-[#394457] cursor-pointer transition-colors duration-200 flex items-center"
            onClick={() => setIsSampleModalOpen(true)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            Sample Polices
          </button>
        
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden ">
        <EditorPanel
          policyJson={highlightedJson}
          onPolicyChange={handlePolicyChange}
          onValidate={handleValidate}
          onClear={handleClear}
          onSampleClick={() => setIsSampleModalOpen(true)}
          validationStatus={validationStatus}
        />
        
        <VisualizationPanel policySummary={policySummary} />
      </main>

      {/* Sample Policy Modal */}
      <SamplePolicyModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelect={setPolicyJson}
      />
    </div>
  );
}