// genshinApi.js
import axios from 'axios';

const BASE_URL = 'https://genshin.jmp.blue';

const genshinApi = axios.create({
  baseURL: BASE_URL,
});

const fetchEntityImage = async (type, id, imageType) => {
  try {
    const response = await genshinApi.get(`/${type}/${id}/${imageType}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${imageType} image for ${type} ${id}:`, error);
    throw error;
  }
};

const fetchCharacterDetails = async (characterId) => {
  try {
    const response = await genshinApi.get(`/characters/${characterId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching character details for ${characterId}:`, error);
    throw error;
  }
};

const fetchCharacters = async () => {
  try {
    const response = await genshinApi.get('/characters');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch characters');
  }
};

const fetchAllCharacterNames = async () => {
  try {
    const response = await genshinApi.get('/characters');
    return response.data;
  } catch (error) {
    console.error('Error fetching character names:', error);
    throw error;
  }
};

export { genshinApi, fetchEntityImage, fetchCharacterDetails, fetchCharacters, fetchAllCharacterNames };
