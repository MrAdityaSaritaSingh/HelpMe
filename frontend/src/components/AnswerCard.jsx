import { useState } from 'react';
import { FiCopy, FiDownload } from 'react-icons/fi';

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
      a.click();
      URL.revokeObjectURL(url);
    };
  
    // Function to parse the answer and replace citations with links
    const formatAnswer = (text) => {
      // Split the text into parts based on the citation pattern
      return text.split(/(\d+)/g).map((part, index) => {
        const match = part.match(/(\d+)/);
        if (match) {
          const sourceIndex = parseInt(match[1], 10) - 1;
          if (sources && sources[sourceIndex]) {
            return (
              <a
                key={index}
                href={sources[sourceIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 font-bold text-blue-600 no-underline bg-blue-100 rounded-full w-6 h-6 inline-flex items-center justify-center hover:bg-blue-200 transition-colors"
                title={sources[sourceIndex].title}
              >
                {match[1]}
              </a>
            );
          }
        }
        // Check for "Sources" heading to make it bold
        if (part.trim().toLowerCase() === 'sources') {
          return <strong key={index} className="text-xl block mt-6 mb-2">{part}</strong>;
        }
        return <span key={index}>{part}</span>;
      });
    };
  
    return (
      <div className="w-full max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Answer</h2>
            <div className="flex space-x-2">
              <button onClick={handleCopy} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors">
                {copied ? <span className="text-sm text-green-600">Copied!</span> : <FiCopy />}
              </button>
              <button onClick={handleDownload} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors">
                <FiDownload />
              </button>
            </div>
          </div>
          <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
            {formatAnswer(finalAnswer)}
          </div>
        </div>
      </div>
    );
  };

  export default AnswerCard;