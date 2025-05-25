import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PolicyTree({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center text-white">
        No resources to display. Validate a policy to see resources.
      </div>
    );
  }

  return (
    <div className="tree-visualization">
      <ul className="space-y-2">
        {data.map((node, index) => (
          <TreeNode key={index} node={node} level={0} />
        ))}
      </ul>
    </div>
  );
}

function TreeNode({ node, level }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  
  // Icon based on node type
  const getIcon = () => {
    switch (node.type) {
      case "service":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400  h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        );
      case "resource":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-[#71a9fa] h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-[#71a9fa] h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: level * 0.1 }}
      className="tree-node "
    >
      <div 
        className={`flex items-center ${hasChildren ? "cursor-pointer " : ""} ${level > 0 ? "px-3 py-2 bg-[#384455] rounded-md group  hover:bg-gray-600 transition-colors duration-200" : ""}`}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="mr-1 "
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
        
        {getIcon()}
        
        <span className={`${node.type === "service" ? "font-medium text-white" : "text-white font-mono text-sm"}`}>
          {node.name}
        </span>
        
        {node.type === "service" && (
          <span className="ml-2 text-xs text-gray-400">
            ({node.name === "S3" ? "AWS Simple Storage Service" : node.name === "EC2" ? "AWS Elastic Compute Cloud" : node.name === "DYNAMODB" ? "AWS DynamoDB" : "AWS Service"})
          </span>
        )}
        
        <span className="ml-auto">
          {node.isAllowed ? (
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="text-success"
            >
              <CheckIcon />
            </motion.span>
          ) : (
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="text-destructive"
            >
              <XIcon />
            </motion.span>
          )}
        </span>
        
        
      </div>
      
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-6 mt-2 space-y-2"
          >
            {node.children?.map((childNode, index) => (
              <TreeNode key={index} node={childNode} level={level + 1} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="text-[#67c659]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="text-red-700" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  );
}