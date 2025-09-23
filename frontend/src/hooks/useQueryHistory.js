import { useState, useEffect } from 'react';

export const useQueryHistory = () => {
  const [queryHistory, setQueryHistory] = useState([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('queryHistory');
    if (savedHistory) {
      setQueryHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
  }, [queryHistory]);

  const addToHistory = (query) => {
    if (!queryHistory.includes(query)) {
      const newHistory = [query, ...queryHistory].slice(0, 10);
      setQueryHistory(newHistory);
    }
  };

  const clearHistory = () => {
    setQueryHistory([]);
  };

  return { queryHistory, addToHistory, clearHistory };
};
