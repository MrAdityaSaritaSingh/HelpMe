import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import AnswerCard from './components/AnswerCard';
import DebugPanel from './components/DebugPanel';
import ModelSelector from './components/ModelSelector';
import ProviderSelector from './components/ProviderSelector';
import { research } from './services/api';

const models = {
  gemini: ["gemini-1.5-flash"],
  openrouter: [
    "deepseek/deepseek-chat-v3.1:free",
    "openai/gpt-oss-120b:free",
    "google/gemma-7b-it:free",
    "microsoft/phi-2:free",
    "mistralai/mistral-7b-instruct:free",
  ],
};

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [researchData, setResearchData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('openrouter');
  const [selectedModel, setSelectedModel] = useState(models.openrouter[0]);

  useEffect(() => {
    setSelectedModel(models[selectedProvider][0]);
  }, [selectedProvider]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setFinalAnswer('');
    setResearchData(null);
    setError(null);
    try {
      const data = await research(query, selectedModel, selectedProvider);
      setFinalAnswer(data.final_answer);
      setResearchData(data.research_data);
    } catch (error) {
      setError('An error occurred while fetching the research data. Please try again later.');
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
          <ProviderSelector selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} loading={loading} />
          <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} loading={loading} models={models[selectedProvider]} />

          {loading && <LoadingSpinner />}

          {error && <div className="text-red-500 text-center mt-4">{error}</div>}

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