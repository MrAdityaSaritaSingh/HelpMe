import { useState } from 'react';
import { FiCopy, FiDownload, FiCheck } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const AnswerCard = ({ finalAnswer, sources }) => {
    const [copied, setCopied] = useState(false);
  
    const handleCopy = () => {
      navigator.clipboard.writeText(finalAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
  
    const handleDownload = () => {
      const blob = new Blob([finalAnswer], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'research_answer.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    // Custom renderer for paragraphs to handle citation linking
    const customRenderers = {
      p: ({ node, children }) => {
        const processedChildren = [];
        const childrenArray = Array.isArray(children) ? children : [children];

        childrenArray.forEach((child, i) => {
          if (typeof child === 'string') {
            const parts = child.split(/(\[\d+\])/g);
            
            parts.forEach((part, j) => {
              const match = part.match(/\[(\d+)\]/);
              if (match) {
                const sourceIndex = parseInt(match[1], 10) - 1;
                if (sources && sources[sourceIndex]) {
                  processedChildren.push(
                    <a
                      key={`${i}-${j}`}
                      href={sources[sourceIndex].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-1 font-medium text-blue-600 no-underline hover:underline"
                      title={sources[sourceIndex].title}
                    >
                      <sup>[{match[1]}]</sup>
                    </a>
                  );
                } else {
                  processedChildren.push(part); // Render as text if source not found
                }
              } else {
                processedChildren.push(part);
              }
            });
          } else {
            processedChildren.push(child); // Pass through other elements like <strong>
          }
        });
        return <p>{processedChildren}</p>;
      }
    };
  
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Answer</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleCopy} 
                className="group relative flex items-center justify-center p-2 w-28 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
              >
                {copied ? <FiCheck className="text-green-500 w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
                <span className="ml-2 text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button 
                onClick={handleDownload} 
                className="group relative flex items-center justify-center p-2 w-32 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
              >
                <FiDownload className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium">Download</span>
              </button>
            </div>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown components={customRenderers}>
              {finalAnswer}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  export default AnswerCard;