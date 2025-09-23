import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const DebugPanel = ({ researchData }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="w-full max-w-3xl mx-auto mt-8">
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
          >
            <span className="font-semibold text-gray-700">Raw Research JSON</span>
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {isOpen && (
            <div className="p-4 bg-gray-900 text-white rounded-b-lg">
              <pre className="text-sm whitespace-pre-wrap">
                <code>{JSON.stringify(researchData, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default DebugPanel;