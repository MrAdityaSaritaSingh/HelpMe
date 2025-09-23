import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import AnswerCard from './components/AnswerCard';
import DebugPanel from './components/DebugPanel';
import ModelSelector from './components/ModelSelector';
import ProviderSelector from './components/ProviderSelector';
import Sources from './components/Sources';
import { research, getModels } from './services/api';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [researchData, setResearchData] = useState(null);
  const [error, setError] = useState(null);
  
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [modelsForProvider, setModelsForProvider] = useState([]);
  const [queryHistory, setQueryHistory] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getModels();
        setProviders(data.providers);
        if (data.providers.length > 0) {
          const defaultProvider = data.providers.find(p => p.name === 'openrouter') || data.providers[0];
          setSelectedProvider(defaultProvider.name);
          setModelsForProvider(defaultProvider.models);
          setSelectedModel(defaultProvider.models[0]);
        }
      } catch (err) {
        setError('Failed to fetch models from the backend.');
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    const provider = providers.find(p => p.name === selectedProvider);
    if (provider) {
      setModelsForProvider(provider.models);
      setSelectedModel(provider.models[0]);
    }
  }, [selectedProvider, providers]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setFinalAnswer('');
    setResearchData(null);
    setError(null);

    // Add to history
    if (!queryHistory.includes(query)) {
      const newHistory = [query, ...queryHistory].slice(0, 10);
      setQueryHistory(newHistory);
    }

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
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tighter">HelpMe</h1>
          <p className="text-lg text-gray-500 mt-3 tracking-wide">Your smart tool for deep-dive research.</p>
        </header>

        <main>
          <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/80">
            <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} loading={loading} />
            <div className="flex items-center justify-center gap-4 mt-4">
              <ProviderSelector selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} loading={loading} providers={providers} />
              <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} loading={loading} models={modelsForProvider} />
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {error && <div className="text-red-500 text-center mt-8 font-medium">{error}</div>}

          {finalAnswer && (
            <div className="mt-12 animate-fade-in-slide-up">
              <AnswerCard finalAnswer={finalAnswer} sources={researchData?.sources || []} />
              <Sources sources={researchData?.sources || []} />
              {researchData && <DebugPanel researchData={researchData} />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
