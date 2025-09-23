import { useState } from 'react';
import { research } from '../services/api';

export const useResearch = () => {
  const [loading, setLoading] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [researchData, setResearchData] = useState(null);
  const [error, setError] = useState(null);

  const performSearch = async (query, model, provider) => {
    if (!query.trim()) return;
    setLoading(true);
    setFinalAnswer('');
    setResearchData(null);
    setError(null);

    try {
      const data = await research(query, model, provider);
      setFinalAnswer(data.final_answer);
      setResearchData(data.research_data);
    } catch (err) {
      setError('An error occurred while fetching the research data. Please try again later.');
    }
    setLoading(false);
  };

  return { loading, finalAnswer, researchData, error, performSearch };
};
