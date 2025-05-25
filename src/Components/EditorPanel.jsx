import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { validatePolicy, highlightJSON } from "../lib/utils/policy-utils";

export function EditorPanel({
  policyJson,
  onPolicyChange,
  onValidate,
  onClear,
  onSampleClick,
  validationStatus,
}) {
  const editorRef = useRef(null);
  const [lineNumbers, setLineNumbers] = useState([]);

  // Update line numbers when policy changes
  useEffect(() => {
    const lines = policyJson.split('\n');
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => String(i + 1)));
  }, [policyJson]);

  // Handle editor input
  const handleEditorInput = (e) => {
    if (editorRef.current) {
      onPolicyChange(editorRef.current.textContent || "");
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Ctrl+Enter to validate
    if (e.ctrlKey && e.key === "Enter") {
      onValidate();
    }
  };

  return (
    <div className="w-full md:w-1/2 h-full overflow-auto border-r border-gray-700 flex flex-col bg-[#252D3D] ">
      <div className="p-4  border-b border-gray-700 flex justify-between items-center ">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5  text-[#739FF2]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h2 className="text-lg font-medium text-white ">IAM Policy Input</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onValidate}
            className="px-3 py-1.5 hover:bg-gray-600 bg-[#739FF2] text-white text-sm rounded-md transition-colors cursor-pointer duration-200 flex items-center"
            title="Validate Policy (Ctrl+Enter)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Validate
          </button>
          
          <button
            onClick={onClear}
            className="px-3 py-1.5 bg-[#394457] pointer hover:bg-gray-600 text-white text-sm rounded-md transition-colors cursor-pointer duration-200"
            title="Clear editor content"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Clear
          </button>
          
          <button
            onClick={onSampleClick}
            className="px-3 py-1.5 border border-gray-600 text-white text-sm rounded-md transition-colors duration-200 flex items-center cursor-pointer"
            title="Load sample policies"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Samples
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {validationStatus && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`px-4 py-2 ${validationStatus.valid ? "bg-[#67c659] text-white" : "bg-red-900 text-white"} text-sm flex items-center`}
          >
            {validationStatus.valid ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Valid IAM Policy JSON
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {validationStatus.error}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 overflow-auto ">
        <div className="relative h-full">
          <div className="absolute inset-0 p-4 bg-background rounded-md">
            {/* Line Numbers */}
            <div className="absolute left-4 top-4 text-gray-500 font-mono text-xs select-none leading-relaxed">
              {lineNumbers.map((num) => (
                <div key={num} className="h-6">{num}</div>
              ))}
            </div>
            {/* Code Editor Content */}
            <pre
              ref={editorRef}
              className="pl-8 outline-none font-mono text-sm leading-relaxed h-full w-full whitespace-pre"
              contentEditable
              suppressContentEditableWarning
              spellCheck="false"
              onInput={handleEditorInput}
              onKeyDown={handleKeyDown}
              dangerouslySetInnerHTML={{ __html: policyJson }}
            ></pre>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-surface border-t border-gray-700 text-xs text-gray-400">
        <div className="flex justify-between items-center">
          <div>Press Validate to analyze policy</div>
          <div className="flex items-center">
            <motion.span
              animate={{
                color: validationStatus?.valid ? "#10B981" : "#EF4444",
              }}
              className="flex items-center"
            >
              {validationStatus?.valid ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-success mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Valid JSON
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-destructive mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Invalid JSON
                </>
              )}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}