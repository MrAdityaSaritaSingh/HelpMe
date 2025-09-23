import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const research = async (query) => {
  try {
    const response = await axios.post(`${API_URL}/research`, { query });
    return response.data;
  } catch (error) {
    console.error('Error fetching research data:', error);
    throw error;
  }
};
