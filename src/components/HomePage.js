import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios library for making HTTP requests
import quotes from '../data/quotes.json';
import '../styles/HomePage.css';

const HomePage = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomQuote, setRandomQuote] = useState('');
  const [quoteCharacter, setQuoteCharacter] = useState('');

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        // Fetch character names directly from genshin-db-api endpoint
        const response = await axios.get('https://genshin-db-api.vercel.app/api/characters?query=names&matchCategories=true');
        const characterNames = response.data;

        // Handle special cases
        const formattedCharacters = characterNames.map(character => ({
          name: character,
          imageUrl: getSpecialCaseImageSrc(character)
        }));

        setCharacters(formattedCharacters);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, []);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const { quote, character } = quotes[randomIndex];
    return { quote, character };
  };

  useEffect(() => {
    const { quote, character } = getRandomQuote();
    setRandomQuote(quote);
    setQuoteCharacter(character);
  }, []);

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
      default:
        return `UI_AvatarIcon_${characterName.replace(/\s+/g, '')}`;
    }
  };

  return (
    <div className="HomePage">
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
                  {/* Dynamic image source based on character name */}
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
