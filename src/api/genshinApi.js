// genshinApi.js
import axios from 'axios';

const NEW_BASE_URL = 'https://genshin-db-api.vercel.app/api';

const newApi = axios.create({
  baseURL: NEW_BASE_URL,
});

const fetchAllCharacterNames = async () => {
  try {
    const response = await newApi.get('/characters?query=names&matchCategories=true');
    return response.data;
  } catch (error) {
    console.error('Error fetching character names:', error);
    throw error;
  }
};

export { newApi, fetchAllCharacterNames };
