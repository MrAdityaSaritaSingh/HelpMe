import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const getModels = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/models`);
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const research = async (query, model, provider) => {
  try {
    const response = await axios.post(`${API_URL}/api/research`, { query, model, provider });
    return response.data;
  } catch (error) {
    console.error('Error fetching research data:', error);
    throw error;
  }
};
