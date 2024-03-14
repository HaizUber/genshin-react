import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFiveStarCharacters, getFourStarCharacters, fetchAllCharacterNames, getCharactersByElement } from '../api/genshinApi';
import quotes from '../data/quotes.json';
import anemoCharacters from '../data/anemoCharacters.json'; // Import the anemoCharacters.json file
import cryoCharacters from '../data/cryoCharacters.json'; // Import the cryoCharacters.json file
import dendroCharacters from '../data/dendroCharacters.json'; // Import the dendroCharacters.json file
import electroCharacters from '../data/electroCharacters.json'; // Import the electroCharacters.json file
import geoCharacters from '../data/geoCharacters.json'; // Import the geoCharacters.json file
import hydroCharacters from '../data/hydroCharacters.json'; // Import the hydroCharacters.json file
import pyroCharacters from '../data/pyroCharacters.json'; // Import the pyroCharacters.json file
import '../styles/HomePage.css';

const HomePage = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomQuote, setRandomQuote] = useState('');
  const [quoteCharacter, setQuoteCharacter] = useState('');
  const [filterOptions, setFilterOptions] = useState({ rarity: null, element: null });
  const [allCharacterNames, setAllCharacterNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const characterNames = await fetchAllCharacterNames();
        setAllCharacterNames(characterNames);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const { quote, character } = quotes[randomIndex];
      return { quote, character };
    };

    const { quote, character } = getRandomQuote();
    setRandomQuote(quote);
    setQuoteCharacter(character);
  }, []);

  useEffect(() => {
    const filterCharacters = async () => {
      try {
        let filteredCharacters = [];

        if (filterOptions.rarity === '5') {
          filteredCharacters = await getFiveStarCharacters();
        } else if (filterOptions.rarity === '4') {
          filteredCharacters = await getFourStarCharacters();
        } else {
          filteredCharacters = allCharacterNames;
        }

        if (filterOptions.element) {
          let elementCharacterNames = [];
          switch (filterOptions.element) {
            case 'Anemo':
              elementCharacterNames = anemoCharacters;
              break;
            case 'Cryo':
              elementCharacterNames = cryoCharacters;
              break;
            case 'Dendro':
              elementCharacterNames = dendroCharacters;
              break;
            case 'Electro':
              elementCharacterNames = electroCharacters;
              break;
            case 'Geo':
              elementCharacterNames = geoCharacters;
              break;
            case 'Hydro':
              elementCharacterNames = hydroCharacters;
              break;
            case 'Pyro':
              elementCharacterNames = pyroCharacters;
              break;
            default:
              break;
          }
          filteredCharacters = filteredCharacters.filter(character => elementCharacterNames.includes(character));
        }

        setCharacters(filteredCharacters.map(character => ({
          name: character,
          imageUrl: getSpecialCaseImageSrc(character)
        })));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    filterCharacters();
  }, [filterOptions, allCharacterNames]);

  const handleFilterOption = (option) => {
    setFilterOptions(prevOptions => ({
      ...prevOptions,
      [option.type]: option.value === prevOptions[option.type] ? null : option.value
    }));
  };

  const getSpecialCaseImageSrc = (characterName) => {
    switch (characterName) {
      case 'Aether':
        return 'UI_AvatarIcon_PlayerBoy';
      case 'Alhaitham':
        return 'UI_AvatarIcon_Alhatham';
      case 'Amber':
        return 'UI_AvatarIcon_Ambor';
      case 'Arataki Itto':
        return 'UI_AvatarIcon_Itto';
      case 'Baizhu':
        return 'UI_AvatarIcon_Baizhuer';
      case 'Hu Tao':
        return 'UI_AvatarIcon_Hutao';
      case 'Jean':
        return 'UI_AvatarIcon_Qin';
      case 'Kaedehara Kazuha':
        return 'UI_AvatarIcon_Kazuha';
      case 'Kamisato Ayaka':
        return 'UI_AvatarIcon_Ayaka';
      case 'Kamisato Ayato':
        return 'UI_AvatarIcon_Ayato';
      case 'Kirara':
        return 'UI_AvatarIcon_Momoka';
      case 'Kujou Sara':
        return 'UI_AvatarIcon_Sara';
      case 'Kuki Shinobu':
        return 'UI_AvatarIcon_Shinobu';
      case 'Lumine':
        return 'UI_AvatarIcon_PlayerGirl';
      case 'Lynette':
        return 'UI_AvatarIcon_Linette';
      case 'Lyney':
        return 'UI_AvatarIcon_Liney';
      case 'Noelle':
        return 'UI_AvatarIcon_Noel';
      case 'Raiden Shogun':
        return 'UI_AvatarIcon_Shougun';
      case 'Sangonomiya Kokomi':
        return 'UI_AvatarIcon_Kokomi';
      case 'Shikanoin Heizou':
        return 'UI_AvatarIcon_Heizo';
      case 'Thoma':
        return 'UI_AvatarIcon_Tohma';
      case 'Yae Miko':
        return 'UI_AvatarIcon_Yae';
      case 'Yanfei':
        return 'UI_AvatarIcon_Feiyan';
      case 'Yun Jin':
        return 'UI_AvatarIcon_Yunjin';
      case 'Xianyun':
        return 'UI_AvatarIcon_Liuyun';
      default:
        return `UI_AvatarIcon_${characterName.replace(/\s+/g, '')}`;
    }
  };
  return (
    <div className="HomePage">
      <div className="filter-options">
        <div className="rarity-filters">
          <button onClick={() => handleFilterOption({ type: 'rarity', value: '5' })} className={filterOptions.rarity === '5' ? 'active' : ''}>5<img src={process.env.PUBLIC_URL + '/assets/icons/star.png'} alt="5star" /></button>
          <button onClick={() => handleFilterOption({ type: 'rarity', value: '4' })} className={filterOptions.rarity === '4' ? 'active' : ''}>4<img src={process.env.PUBLIC_URL + '/assets/icons/starpurple.png'} alt="4star" /></button>
        </div>
        <div className="separator"></div>
        <div className="element-filters">
        <button onClick={() => handleFilterOption({ type: 'element', value: 'Anemo' })} className={filterOptions.element === 'Anemo' ? 'active' : ''}>
        <img src={process.env.PUBLIC_URL + '/assets/icons/UI_ItemIcon_305.png'} alt="Anemo" /></button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Cryo' })} className={filterOptions.element === 'Cryo' ? 'active' : ''}><img src={process.env.PUBLIC_URL + '/assets/icons/UI_ItemIcon_306.png'} alt="Pyro" /></button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Dendro' })} className={filterOptions.element === 'Dendro' ? 'active' : ''}><img src={process.env.PUBLIC_URL + '/assets/icons/UI_ItemIcon_303.png'} alt="Pyro" /></button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Electro' })} className={filterOptions.element === 'Electro' ? 'active' : ''}><img src={process.env.PUBLIC_URL + '/assets/icons/UI_ItemIcon_304.png'} alt="Pyro" /></button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Geo' })} className={filterOptions.element === 'Geo' ? 'active' : ''}><img src={process.env.PUBLIC_URL + '/assets/icons/UI_ItemIcon_307.png'} alt="Pyro" /></button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Hydro' })} className={filterOptions.element === 'Hydro' ? 'active' : ''}><img src={process.env.PUBLIC_URL + '/assets/icons/UI_ItemIcon_302.png'} alt="Pyro" /></button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Pyro' })} className={filterOptions.element === 'Pyro' ? 'active' : ''}><img src={process.env.PUBLIC_URL + '/assets/icons/UI_ItemIcon_301.png'} alt="Pyro" /></button>
        </div>
      </div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loading-text">"{randomQuote}" - {quoteCharacter}</p>
        </div>
      ) : (
        <div className="site-content">
          {error && <p>Error: {error}</p>}
          <div className="character-list">
            {characters.map((character, index) => (
              <Link key={index} to={`/characters/${character.name}`}>
                <div className="character-card">
                  <img src={process.env.PUBLIC_URL + `/assets/characters/${character.imageUrl}.png`} alt={character.name} />
                  <p>{character.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

