import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCharacterDetail } from '../api/genshinApi';
import '../styles/characterDetailPage.css'; // Import the CSS file
import NavMenu from './NavMenu';
import Footer from './Footer';

const CharacterDetailPage = () => {
  const { characterName } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacterDetail = async () => {
      try {
        setLoading(true);

        // Fetch character data from the first endpoint
        const { data: characterData } = await getCharacterDetail(characterName);
        console.log("Character data:", characterData); // Log character data

        // Fetch additional data including ascension costs from the second endpoint
        const alternativeResponse = await fetch(`https://genshin-db-api.vercel.app/api/characters?query=${characterName}&matchCategories=true`);
        const additionalData = await alternativeResponse.json();
        console.log("Additional data:", additionalData); // Log additional data

        // Merge the additional data into the character data
        const characterWithCosts = {
          ...characterData,
          ...additionalData // Assuming all data from the second endpoint is needed
        };

        setCharacter(characterWithCosts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterDetail();
  }, [characterName]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (!character) {
    return <p className="error-message">Character not found</p>;
  }

// Function to get the special case image source
const getSpecialCaseImageSrc = (characterName) => {
  switch (characterName) {
    case 'Aether':
      return 'UI_Gacha_AvatarImg_PlayerBoy';
    case 'Alhaitham':
      return 'UI_Gacha_AvatarImg_Alhatham';
    case 'Amber':
      return 'UI_Gacha_AvatarImg_Ambor';
    case 'Arataki Itto':
      return 'UI_Gacha_AvatarImg_Itto';
    case 'Baizhu':
      return 'UI_Gacha_AvatarImg_Baizhuer';
    case 'Hu Tao':
      return 'UI_Gacha_AvatarImg_Hutao';
    case 'Jean':
      return 'UI_Gacha_AvatarImg_Qin';
    case 'Kaedehara Kazuha':
      return 'UI_Gacha_AvatarImg_Kazuha';
    case 'Kamisato Ayaka':
      return 'UI_Gacha_AvatarImg_Ayaka';
    case 'Kamisato Ayato':
      return 'UI_Gacha_AvatarImg_Ayato';
    case 'Kirara':
      return 'UI_Gacha_AvatarImg_Momoka';
    case 'Kujou Sara':
      return 'UI_Gacha_AvatarImg_Sara';
    case 'Kuki Shinobu':
      return 'UI_Gacha_AvatarImg_Shinobu';
    case 'Lumine':
      return 'UI_Gacha_AvatarImg_PlayerGirl';
    case 'Lynette':
      return 'UI_Gacha_AvatarImg_Linette';
    case 'Lyney':
      return 'UI_Gacha_AvatarImg_Liney';
    case 'Noelle':
      return 'UI_Gacha_AvatarImg_Noel';
    case 'Raiden Shogun':
      return 'UI_Gacha_AvatarImg_Shougun';
    case 'Sangonomiya Kokomi':
      return 'UI_Gacha_AvatarImg_Kokomi';
    case 'Shikanoin Heizou':
      return 'UI_Gacha_AvatarImg_Heizo';
    case 'Thoma':
      return 'UI_Gacha_AvatarImg_Tohma';
    case 'Yae Miko':
      return 'UI_Gacha_AvatarImg_Yae';
    case 'Yanfei':
      return 'UI_Gacha_AvatarImg_Feiyan';
    case 'Yun Jin':
      return 'UI_Gacha_AvatarImg_Yunjin';
    case 'Xianyun':
      return 'UI_Gacha_AvatarImg_Liuyun';
    default:
      return `UI_Gacha_AvatarImg_${characterName.replace(/\s+/g, '')}`;
  }
};
  // Function to get the material image source based on ID
  const getMaterialImageSrc = (materialId) => {
    return `/assets/materials/UI_ItemIcon_${materialId}.png`;
  };

  return (
    <div className="character-detail-container">
      <NavMenu />
      <div className="character-header">
        <h2>{character.name}</h2>
        <img src={`/assets/characters/${getSpecialCaseImageSrc(characterName)}.png`} alt={characterName} />
      </div>
      <div className="character-info">
        <div className="info-item">
          <h3>Description:</h3>
          <p>{character.description}</p>
        </div>
        <div className="info-item">
          <h3>Rarity:</h3>
          <p>{character.rarity}</p>
        </div>
        <div className="info-item">
          <h3>Element:</h3>
          <p>{character.element}</p>
        </div>
        <div className="info-item">
          <h3>Weapon Type:</h3>
          <p>{character.weapon}</p>
        </div>
        <div className="info-item">
          <h3>Gender:</h3>
          <p>{character.gender}</p>
        </div>
        <div className="info-item">
          <h3>Nation:</h3>
          <p>{character.nation}</p>
        </div>
        <div className="info-item">
          <h3>Affiliation:</h3>
          <p>{character.affiliation}</p>
        </div>
        <div className="info-item">
          <h3>Constellation:</h3>
          <p>{character.constellation}</p>
        </div>
        <div className="info-item">
          <h3>Birthday:</h3>
          <p>{character.birthday}</p>
        </div>
        <div className="info-item">
          <h3>Release Date:</h3>
          <p>{character.release}</p>
        </div>
      </div>
      <div className="character-section">
        <h3>Talents:</h3>
        {character.skillTalents && character.skillTalents.map((talent) => (
          <div key={talent.name} className="talent">
            <h4>{talent.name}</h4>
            <p>{talent.description}</p>
          </div>
        ))}
      </div>
      <div className="character-section">
        <h3>Passive Talents:</h3>
        {character.passiveTalents && character.passiveTalents.map((talent) => (
          <div key={talent.name} className="passive-talent">
            <h4>{talent.name}</h4>
            <p>{talent.description}</p>
          </div>
        ))}
      </div>
      <div className="character-section">
        <h3>Constellations:</h3>
        {character.constellations && character.constellations.map((constellation) => (
          <div key={constellation.name} className="constellation">
          <h4>{constellation.name}</h4>
          <p>{constellation.description}</p>
        </div>
      ))}
    </div>
    <div className="character-section">
        <h3>Ascension Costs:</h3>
        {character && character.costs && Object.entries(character.costs).map(([ascendLevel, items]) => (
          <div key={ascendLevel} className="ascension-level">
            <h4>Ascension Level {ascendLevel.slice(-1)}</h4>
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  <img src={getMaterialImageSrc(item.id)} alt={item.name} />
                  {item.name}: {item.count}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
    </div>
);
};
<div><Footer /></div>
export default CharacterDetailPage;

