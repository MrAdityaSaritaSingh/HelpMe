import { useState } from 'react';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import AnswerCard from './components/AnswerCard';
import DebugPanel from './components/DebugPanel';
import ModelSelector from './components/ModelSelector';
import ProviderSelector from './components/ProviderSelector';
import Sources from './components/Sources';
import QueryHistory from './components/QueryHistory';
import { useQueryHistory } from './hooks/useQueryHistory';
import { useModelSelection } from './hooks/useModelSelection';
import { useResearch } from './hooks/useResearch';

function App() {
  const [query, setQuery] = useState('');
  const { queryHistory, addToHistory, clearHistory } = useQueryHistory();
  const {
    providers,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    modelsForProvider,
    error: modelError,
  } = useModelSelection();
  const { loading, finalAnswer, researchData, error: researchError, performSearch } = useResearch();

  const handleSearch = () => {
    performSearch(query, selectedModel, selectedProvider);
    addToHistory(query);
  };

  const handleSelectQuery = (selectedQuery) => {
    setQuery(selectedQuery);
  };

  const error = modelError || researchError;

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
              <ProviderSelector
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                loading={loading}
                providers={providers}
              />
              <ModelSelector
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                loading={loading}
                models={modelsForProvider}
              />
            </div>
          </div>

          <QueryHistory history={queryHistory} onSelect={handleSelectQuery} onClear={clearHistory} />

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