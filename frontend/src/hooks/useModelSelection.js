import { useState, useEffect } from 'react';
import { getModels } from '../services/api';

export const useModelSelection = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [modelsForProvider, setModelsForProvider] = useState([]);
  const [error, setError] = useState(null);

  // Fetch models on initial render
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getModels();
        setProviders(data.providers);
        if (data.providers.length > 0) {
          const defaultProvider = data.providers.find(p => p.name === 'openrouter') || data.providers[0];
          setSelectedProvider(defaultProvider.name);
        }
      } catch (err) {
        setError('Failed to fetch models from the backend.');
      }
    };
    fetchModels();
  }, []);

  // Update models when provider changes
  useEffect(() => {
    const provider = providers.find(p => p.name === selectedProvider);
    if (provider) {
      setModelsForProvider(provider.models);
      setSelectedModel(provider.models[0]);
    }
  }, [selectedProvider, providers]);

  return {
    providers,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    modelsForProvider,
    error
  };
};
