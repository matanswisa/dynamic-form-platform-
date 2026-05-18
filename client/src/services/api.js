import axios from 'axios';

// Base URL (use .env file for actual deployments)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Submit form data to backend.
 * @param {Object} data - The form data object (e.g., { name: "John", email: "john@example.com" })
 */
export async function submitForm(data) {
  console.log(data)
  const response = await API.post('/submit', { data });
  return response.data;
}


export const fetchSubmissions = async () => {
  const res = await API.get('/submissions');
  return res.data;
};
