import { useState } from 'react';
import axios from 'axios';
import { FiSearch, FiCopy, FiDownload, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Helper function to get favicon URL
const getFaviconUrl = (url) => {
  try {
    const urlObject = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=32`;
  } catch (error) {
    return 'https://www.google.com/s2/favicons?domain=google.com&sz=32'; // Fallback favicon
  }
};

// Component for the search bar and button
const SearchBar = ({ query, setQuery, handleSearch, loading }) => (
  <div className="w-full max-w-2xl mx-auto">
    <div className="relative">
      <input
        type="text"
        className="w-full px-5 py-3 text-lg text-gray-700 bg-white border-2 border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
        placeholder="What do you want to research today?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        disabled={loading}
      />
      <button
        className="absolute inset-y-0 right-0 flex items-center px-6 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-300"
        onClick={handleSearch}
        disabled={loading}
      >
        <FiSearch className="w-6 h-6" />
        <span className="ml-2 text-lg font-semibold">{loading ? 'Researching...' : 'Research'}</span>
      </button>
    </div>
  </div>
);

// Component for the loading animation
const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2 mt-10">
    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-150"></div>
    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-300"></div>
    <p className="ml-4 text-lg text-gray-600">Analyzing sources and generating answer...</p>
  </div>
);

// Component to display the final answer
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

// Component for the collapsible debug panel
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


function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [researchData, setResearchData] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setFinalAnswer('');
    setResearchData(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/research', { query });
      setFinalAnswer(response.data.final_answer);
      setResearchData(response.data.research_data);
    } catch (error) {
      console.error('Error fetching research data:', error);
      // You could set an error state here to show a message to the user
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">HelpMe</h1>
          <p className="text-lg text-gray-600 mt-2">Your smart tool for deep-dive.</p>
        </header>

        <main>
          <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} loading={loading} />

          {loading && <LoadingSpinner />}

          {finalAnswer && (
            <>
              <AnswerCard finalAnswer={finalAnswer} sources={researchData?.sources || []} />
              {researchData && <DebugPanel researchData={researchData} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
