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

const getFiveStarCharacters = async () => {
  try {
    const response = await newApi.get('/characters?query=5&matchCategories=true');
    return response.data;
  } catch (error) {
    console.error('Error fetching 5-star characters:', error);
    throw error;
  }
};

const getFourStarCharacters = async () => {
  try {
    const response = await newApi.get('/characters?query=4&matchCategories=true');
    return response.data;
  } catch (error) {
    console.error('Error fetching 5-star characters:', error);
    throw error;
  }
};

// Example of getCharactersByElement in genshinApi.js
export const getCharactersByElement = async (element) => {
  let response = [];
  switch (element) {
    case 'Anemo':
      response = await fetch('/data/anemoCharacters.json');
      break;
    case 'Cryo':
      response = await fetch('/data/cryoCharacters.json');
      break;
    case 'Dendro':
      response = await fetch('/data/dendroCharacters.json');
      break;
    case 'Electro':
      response = await fetch('/data/electroCharacters.json');
      break;
    case 'Geo':
      response = await fetch('/data/geoCharacters.json');
      break;
    case 'Hydro':
      response = await fetch('/data/hydroCharacters.json');
      break;
    case 'Pyro':
      response = await fetch('/data/pyroCharacters.json');
      break;
    default:
      break;
  }
  return response.json();
};

const getCharacterDetail = async (characterName) => {
  try {
    const response = await fetch(`https://genshin-buddy-api.vercel.app/characters/${characterName}`);
    let data = null;

    if (response.ok) {
      data = await response.json();
    }

    return data;
  } catch (error) {
    throw new Error('Failed to fetch character details');
  }
};

const getAlternativeResponse = async (characterName) => {
  try {
    // Extract the first word from the character name and convert it to lowercase
    const firstName = characterName.split('-')[0].toLowerCase();

    const alternativeResponse = await fetch(`https://genshin-db-api.vercel.app/api/characters?query=${firstName}&matchCategories=true`);
    const alternativeData = await alternativeResponse.json();
    return alternativeData;
  } catch (error) {
    throw new Error('Failed to fetch alternative response');
  }
};

export { newApi, fetchAllCharacterNames, getFiveStarCharacters, getFourStarCharacters, getCharacterDetail, getAlternativeResponse };