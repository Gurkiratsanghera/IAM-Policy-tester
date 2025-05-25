import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PolicyTree } from "./PolicyTree";
import { buildResourceTree } from "../lib/utils/policy-utils";

export function VisualizationPanel({ policySummary }) {
  const [expandedStatements, setExpandedStatements] = useState([0]);
  const [activeTab, setActiveTab] = useState("summary");
  
  const toggleStatement = (index) => {
    setExpandedStatements(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const resourceTree = policySummary ? buildResourceTree(policySummary) : [];

  return (
    <div className="w-full md:w-1/2 h-full overflow-auto ">
      {/* Tabs */}
      <div className="w-full">
        <div className="w-full border-b border-gray-700 bg-[#252d3d] flex justify-start h-12 text-white">
          <button 
            className={`px-6 py-3 text-sm cursor-pointer font-medium ${activeTab === "summary" ? "border-b-2 border-[#2765ea]" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            Policy Summary
          </button>
          <button 
            className={`px-6 py-3 text-sm cursor-pointer font-medium ${activeTab === "visualization" ? "border-b-2 border-[#2765ea]" : ""}`}
            onClick={() => setActiveTab("visualization")}
          >
            Visualization
          </button>
          <button 
            className={`px-6 py-3 text-sm cursor-pointer font-medium ${activeTab === "structure" ? "border-b-2 border-[#2765ea]" : ""}`}
            onClick={() => setActiveTab("structure")}
          >
            JSON Structure
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === "summary" && (
            <>
              {policySummary ? (
                <>
                  <div className="bg-[#252d3d] rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="font-medium text-white ">Policy Overview</h3>
                      <span className="text-xs text-gray-400">Version: {policySummary.version}</span>
                    </div>
                    <div className="p-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-3 gap-4 mb-4"
                      >
                        <div className="bg-[#384455] rounded-lg p-4 flex flex-col items-center ">
                          <span className="text-gray-400 text-sm mb-1">Statements</span>
                          <span className="text-2xl font-semibold text-white ">{policySummary.statementCount}</span>
                        </div>
                        <div className="bg-[#384455] rounded-lg p-4 flex flex-col items-center">
                          <span className="text-gray-400 text-sm mb-1">Actions</span>
                          <span className="text-2xl font-semibold text-white">{policySummary.actionCount}</span>
                        </div>
                        <div className="bg-[#384455] rounded-lg p-4 flex flex-col items-center">
                          <span className="text-gray-400 text-sm mb-1">Resources</span>
                          <span className="text-2xl font-semibold text-white">{policySummary.resourceCount}</span>
                        </div>
                      </motion.div>
                      <div className="flex space-x-2 my-2">
                        {policySummary.allowCount > 0 && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="px-2 py-1  bg-opacity-20 text-success text-xs rounded-full flex items-center  bg-[#83C459] text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Allow ({policySummary.allowCount})
                          </motion.span>
                        )}
                        {policySummary.denyCount > 0 && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="px-2 py-1 bg-red-700 text-white bg-opacity-20 text-destructive text-xs rounded-full flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Deny ({policySummary.denyCount})
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Statement Details */}
                  {policySummary.statements.map((statement, index) => (
                    <StatementCard 
                      key={index} 
                      statement={statement} 
                      index={index} 
                      isExpanded={expandedStatements.includes(index)}
                      onToggle={() => toggleStatement(index)}
                    />
                  ))}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-[#252d3d] text-gray-400">
                  <p>No policy data to display. Validate a policy to see the summary.</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === "visualization" && (
            <>
              {policySummary ? (
                <div className="bg-[#252d3d] rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-medium text-white">Permission Tree</h3>
                  </div>
                  <div className="p-4 ">
                    <PolicyTree data={resourceTree} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center bg-[#252d3d] justify-center h-64 text-gray-400">
                  <p>No policy data to visualize. Validate a policy to see the visualization.</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === "structure" && (
            <>
              {policySummary ? (
                <div className="bg-[#252d3d]  rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-medium text-white">JSON Structure :</h3>
                  </div>
                  <div className="p-4">
                    <pre className="bg-background p-4 rounded-md font-mono text-sm text-gray-300 overflow-auto lg:max-h-[675px]  sm:max-h-[480px]">
                      {JSON.stringify(policySummary, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex items-center bg-[#252d3d] justify-center h-64 text-gray-400">
                  <p>No policy data to display. Validate a policy to see the JSON structure.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatementCard({ statement, index, isExpanded, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-[#252d3d] rounded-lg shadow-lg overflow-hidden mb-6"
    >
      <div 
        className="p-4 border-b border-gray-700 flex text-white justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="font-medium flex items-center">
          <span className={`inline-block px-2 py-0.5 ${statement.effect === "Allow" ? "bg-[#83C459] " : "bg-red-700 "} text-xs rounded-full mr-2`}>
            {statement.effect}
          </span>
          Statement {index + 1}
        </h3>
        <motion.button
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Actions</h4>
                <div className="space-y-2">
                  {statement.actions.map((action, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="flex items-center px-3 py-2 bg-[#384455] rounded-md"
                    >
                      {statement.effect === "Allow" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className=" text-[#83C459] h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-red-700 h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="font-mono text-white text-sm">{action}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Resources</h4>
                <div className="space-y-2">
                  {statement.resources.map((resource, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 + 0.2 }}
                      className="flex items-center px-3 py-2 bg-[#384455] rounded-md"
                    >
                      {resource.includes("*") ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-[#71a9fa] h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-[#71a9fa] h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                        </svg>
                      )}
                      <span className="font-mono text-white text-sm">{resource}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {statement.conditions && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Conditions</h4>
                  <div className="bg-[#384455] rounded-md p-3">
                    <pre className="font-mono text-xs text-gray-300 overflow-auto">
                      {JSON.stringify(statement.conditions, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}