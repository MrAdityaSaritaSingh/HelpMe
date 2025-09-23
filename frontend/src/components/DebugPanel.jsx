import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiTerminal } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DebugPanel = ({ researchData }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="border border-gray-200/80 rounded-xl shadow-sm">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100/80 transition-colors duration-200 rounded-t-xl focus:outline-none"
          >
            <div className="flex items-center">
              <FiTerminal className="mr-3 text-gray-500" />
              <span className="font-semibold text-gray-700">Raw Research JSON</span>
            </div>
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {isOpen && (
            <div className="bg-[#282c34] rounded-b-xl overflow-hidden">
              <SyntaxHighlighter 
                language="json" 
                style={atomDark}
                customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem' }}
                wrapLongLines={true}
              >
                {JSON.stringify(researchData, null, 2)}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default DebugPanel;