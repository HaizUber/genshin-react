import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFiveStarCharacters, getFourStarCharacters, fetchAllCharacterNames } from '../api/genshinApi';
import anemoCharacters from '../data/anemoCharacters.json';
import cryoCharacters from '../data/cryoCharacters.json';
import dendroCharacters from '../data/dendroCharacters.json';
import electroCharacters from '../data/electroCharacters.json';
import geoCharacters from '../data/geoCharacters.json';
import hydroCharacters from '../data/hydroCharacters.json';
import pyroCharacters from '../data/pyroCharacters.json';
import bowCharacters from '../data/bowCharacters.json';
import swordCharacters from '../data/swordCharacters.json';
import claymoreCharacters from '../data/claymoreCharacters.json';
import polearmCharacters from '../data/polearmCharacters.json';
import catalystCharacters from '../data/catalystCharacters.json';
import NavMenu from './NavMenu';
import Footer from './Footer';
import '../styles/HomePage.css';

  const HomePage = () => {
  const [loading, setLoading] = useState(false); // Add loading state
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ rarity: null, element: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [allCharacterNames, setAllCharacterNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const characterNames = await fetchAllCharacterNames();
        setAllCharacterNames(characterNames);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterCharacters = async () => {
      setLoading(true); // Set loading to true when filtering
      try {
        let filteredCharacters = [];
  
        if (filterOptions.rarity === '5') {
          filteredCharacters =          await getFiveStarCharacters();
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
  
        if (filterOptions.weaponType) {
          let weaponCharacterNames = [];
          switch (filterOptions.weaponType) {
            case 'Bow':
              weaponCharacterNames = bowCharacters;
              break;
            case 'Sword':
              weaponCharacterNames = swordCharacters;
              break;
            case 'Claymore':
              weaponCharacterNames = claymoreCharacters;
              break;
            case 'Polearm':
              weaponCharacterNames = polearmCharacters;
              break;
            case 'Catalyst':
              weaponCharacterNames = catalystCharacters;
              break;
            default:
              break;
          }
          
          // Filter characters based on the weapon list
          filteredCharacters = filteredCharacters.filter(character => weaponCharacterNames.includes(character));
        }
        if (searchQuery) {
          filteredCharacters = filteredCharacters.filter(character => {
            const lowerCaseName = character.toLowerCase();
            const lowerCaseSearchQuery = searchQuery.toLowerCase();
        
            // Check if the character's name matches the search query
            if (lowerCaseName.includes(lowerCaseSearchQuery)) {
              return true;
            }
        
            // Check if the character is a Traveler and if its element matches the search query
            if (lowerCaseName.includes('traveler')) {
              const elements = ["anemo", "geo", "hydro", "electro", "dendro"];
              return elements.some(element => lowerCaseSearchQuery.includes(element));
            }
        
            return false;
          });
        }
        
        setCharacters(filteredCharacters.map(character => ({
          name: character,
          imageUrl: getSpecialCaseImageSrc(character)
        })));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after filtering
      }
    };
  
    filterCharacters();
  }, [filterOptions, allCharacterNames, searchQuery]);
  
  
  
  

  const handleFilterOption = (option) => {
    setFilterOptions(prevOptions => ({
      ...prevOptions,
      [option.type]: option.value === prevOptions[option.type] ? null : option.value
    }));
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const getSpecialCaseImageSrc = (characterName) => {
    switch (characterName) {
      case 'Aether':
        return 'UI_AvatarIcon_PlayerBoy_Card';
      case 'Alhaitham':
        return 'UI_AvatarIcon_Alhatham_Card';
      case 'Amber':
        return 'UI_AvatarIcon_Ambor_Card';
      case 'Arataki Itto':
        return 'UI_AvatarIcon_Itto_Card';
      case 'Baizhu':
        return 'UI_AvatarIcon_Baizhuer_Card';
      case 'Hu Tao':
        return 'UI_AvatarIcon_Hutao_Card';
      case 'Jean':
        return 'UI_AvatarIcon_Qin_Card';
      case 'Kaedehara Kazuha':
        return 'UI_AvatarIcon_Kazuha_Card';
      case 'Kamisato Ayaka':
        return 'UI_AvatarIcon_Ayaka_Card';
      case 'Kamisato Ayato':
        return 'UI_AvatarIcon_Ayato_Card';
      case 'Kirara':
        return 'UI_AvatarIcon_Momoka_Card';
      case 'Kujou Sara':
        return 'UI_AvatarIcon_Sara_Card';
      case 'Kuki Shinobu':
        return 'UI_AvatarIcon_Shinobu_Card';
      case 'Lumine':
        return 'UI_AvatarIcon_PlayerGirl_Card';
      case 'Lynette':
        return 'UI_AvatarIcon_Linette_Card';
      case 'Lyney':
        return 'UI_AvatarIcon_Liney_Card';
      case 'Noelle':
        return 'UI_AvatarIcon_Noel_Card';
      case 'Raiden Shogun':
        return 'UI_AvatarIcon_Shougun_Card';
      case 'Sangonomiya Kokomi':
        return 'UI_AvatarIcon_Kokomi_Card';
      case 'Shikanoin Heizou':
        return 'UI_AvatarIcon_Heizo_Card';
      case 'Thoma':
        return 'UI_AvatarIcon_Tohma_Card';
      case 'Yae Miko':
        return 'UI_AvatarIcon_Yae_Card';
      case 'Yanfei':
        return 'UI_AvatarIcon_Feiyan_Card';
      case 'Yun Jin':
        return 'UI_AvatarIcon_Yunjin_Card';
      case 'Xianyun':
        return 'UI_AvatarIcon_Liuyun_Card';
        case 'Gaming':
          return 'UI_AvatarIcon_Gaming_Card';
      default:
        return `UI_AvatarIcon_${characterName.replace(/\s+/g, '')}_Card`;
    }
  };

  const getSpecialCharacterName = (characterName) => {
    switch (characterName) {
      case 'Aether':
        return 'Traveller';
      default:
        return `UI_Gacha_AvatarIcon_${characterName.replace(/\s+/g, '')}`;
    }
  };

  if (loading) {
    return <div className="loader"></div>
  }
  return (
    <div className="HomePage">
      <NavMenu />
      <div className="filter-options">
        <div className="rarity-filters">
          <p>Rarity:</p>
          <button onClick={() => handleFilterOption({ type: 'rarity', value: '5' })} className={filterOptions.rarity === '5' ? 'active' : ''}data-tooltip="5 star">5<img src={process.env.PUBLIC_URL + '/assets/icons/star.png'} alt="5star" /></button>
          <button onClick={() => handleFilterOption({ type: 'rarity', value: '4' })} className={filterOptions.rarity === '4' ? 'active' : ''}data-tooltip="4 star">4<img src={process.env.PUBLIC_URL + '/assets/icons/starpurple.png'} alt="4star" /></button>
        </div>
        <div className="separator"></div>
        <div className="element-filters">
          <p>Element:</p>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Anemo' })} className={filterOptions.element === 'Anemo' ? 'active' : ''}data-tooltip="Anemo">
            <img src={process.env.PUBLIC_URL + '/assets/icons/anemo.png'} alt="Anemo" />
          </button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Cryo' })} className={filterOptions.element === 'Cryo' ? 'active' : ''}data-tooltip="Cryo">
            <img src={process.env.PUBLIC_URL + '/assets/icons/cryo.png'} alt="Cryo" />
          </button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Dendro' })} className={filterOptions.element === 'Dendro' ? 'active' : ''}data-tooltip="Dendro">
            <img src={process.env.PUBLIC_URL + '/assets/icons/dendro.png'} alt="Dendro" />
          </button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Electro' })} className={filterOptions.element === 'Electro' ? 'active' : ''}data-tooltip="Electro">
            <img src={process.env.PUBLIC_URL + '/assets/icons/electro.png'} alt="Electro" />
          </button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Geo' })} className={filterOptions.element === 'Geo' ? 'active' : ''}data-tooltip="Geo">
            <img src={process.env.PUBLIC_URL + '/assets/icons/geo.png'} alt="Geo" />
          </button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Hydro' })} className={filterOptions.element === 'Hydro' ? 'active' : ''}data-tooltip="Hydro">
            <img src={process.env.PUBLIC_URL + '/assets/icons/hydro.png'} alt="Hydro" />
          </button>
          <button onClick={() => handleFilterOption({ type: 'element', value: 'Pyro' })} className={filterOptions.element === 'Pyro' ? 'active' : ''}data-tooltip="Pyro">
            <img src={process.env.PUBLIC_URL + '/assets/icons/pyro.png'} alt="Pyro" />
          </button>
        </div>
        <div className="separator"></div>
        <div className="weapon-type-filters">
          <p>Weapon Type:</p>
          <button onClick={() => handleFilterOption({ type: 'weaponType', value: 'Bow' })} className={filterOptions.weaponType === 'Bow' ? 'active' : ''} data-tooltip="Bow">
            <img src={process.env.PUBLIC_URL + '/assets/weapons/UI_EquipIcon_Bow_Zephyrus.png'} alt="Bow" />
          </button>
          <button onClick={() => handleFilterOption({ type: 'weaponType', value: 'Sword' })} className={filterOptions.weaponType === 'Sword' ? 'active' : ''}data-tooltip="Sword">
            <img src={process.env.PUBLIC_URL + '/assets/weapons/UI_EquipIcon_Sword_Blunt_Awaken.png'} alt="Sword" />
          </button>
          <button onClick={() => handleFilterOption({ type: 'weaponType', value: 'Claymore' })} className={filterOptions.weaponType === 'Claymore' ? 'active' : ''}data-tooltip="Claymore">
            <img src={process.env.PUBLIC_URL + '/assets/weapons/UI_EquipIcon_Claymore_Zephyrus.png'} alt="Claymore" />
          </button>
          <button onClick={() => handleFilterOption({ type: 'weaponType', value: 'Polearm' })} className={filterOptions.weaponType === 'Polearm' ? 'active' : ''}data-tooltip="Polearm">
            <img src={process.env.PUBLIC_URL + '/assets/weapons/UI_EquipIcon_Pole_Noire.png'} alt="Polearm" />
          </button>
          <button onClick={() => handleFilterOption({ type: 'weaponType', value: 'Catalyst' })} className={filterOptions.weaponType === 'Catalyst' ? 'active' : ''}data-tooltip="Catalyst">
            <img src={process.env.PUBLIC_URL + '/assets/weapons/UI_EquipIcon_Catalyst_Zephyrus.png'} alt="Catalyst" />
          </button>
          </div>
          <div className="search-bar">
    <svg className="magnifying-glass-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M21.707 20.293l-5.081-5.081A7.942 7.942 0 0 0 18 11a8 8 0 1 0-8 8 7.942 7.942 0 0 0 3.212-.676l5.081 5.081a1 1 0 0 0 1.414-1.414zM4 11a7 7 0 1 1 7 7 7 7 0 0 1-7-7z"/>
    </svg>
    <input
        type="text"
        placeholder="Search character..."
        value={searchQuery}
        onChange={handleSearchChange}
    />
            {searchQuery && (
          <button className="clear-icon" onClick={handleClearSearch}>
            &#x2715;
          </button>
        )}
</div>

      </div>
      <div className="site-content">
      <div className="character-list">
  {[
    ...characters.filter(character => character.name !== "Aether" && character.name !== "Lumine"), // Exclude Aether and Lumine
    { name: "Traveler Anemo", element: "Anemo", weaponType: "Sword", rarity: 5 },
    { name: "Traveler Geo", element: "Geo", weaponType: "Sword", rarity: 5 },
    { name: "Traveler Electro", element: "Electro", weaponType: "Sword", rarity: 5 },
    { name: "Traveler Dendro", element: "Dendro", weaponType: "Sword", rarity: 5 },
    { name: "Traveler Hydro", element: "Hydro", weaponType: "Sword", rarity: 5 }
  ].filter(character => {
    // Check if searchQuery matches the character name or if it's a Traveler matching the search query
    if (searchQuery) {
      return (
        character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (character.name.startsWith("Traveler") && searchQuery.toLowerCase().includes("traveler"))
      );
    } else {
      return true; // Display all characters if there's no search query
    }
  }).filter(character => {
    // Filter by element if filterOptions.element is set
    if (filterOptions.element && character.name.startsWith("Traveler")) {
      return character.element.toLowerCase() === filterOptions.element.toLowerCase();
    } else {
      return true; // Include all characters if element filter is not set or character is not a Traveler
    }
  }).filter(character => {
    // Filter by weapon type if filterOptions.weaponType is set
    if (filterOptions.weaponType && character.name.startsWith("Traveler")) {
      return character.weaponType.toLowerCase() === filterOptions.weaponType.toLowerCase();
    } else {
      return true; // Include all characters if weapon type filter is not set or character is not a Traveler
    }
  }).filter(character => {
    // Filter by rarity if filterOptions.rarity is set
    if (filterOptions.rarity && character.name.startsWith("Traveler")) {
      return character.rarity === parseInt(filterOptions.rarity);
    } else {
      return true; // Include all characters if rarity filter is not set or character is not a Traveler
    }
  }).map((character, index) => {
    // Check if the character is Aether, Lumine, or a Traveler
    if (character.name.startsWith("Traveler")) {
      // Render cards for each element of the Traveler
      const element = character.name.split(" ")[1];
      return (
        <a key={index} href={`/characters/${character.name.replace(/\s/g, '-')}`} target="_blank" rel="noopener noreferrer">
          <div className="card">
            <div className="wrapper">
              <img
                src={process.env.PUBLIC_URL + `/assets/characters/UI_AvatarIcon_PlayerGirl_Card.png`}
                alt={`Traveler ${element}`}
                className="cover-image"
              />
            </div>
            <div className="character-name">{character.name}</div>
            <img
              src={process.env.PUBLIC_URL + `/assets/characters/character-traveler-card.png`}
              alt={`Traveler ${element}`}
              className="character"
            />
          </div>
        </a>
      );
    } else {
      // Render normal character card
      return (
        <a key={index} href={`/characters/${character.name.replace(/\s/g, '-')}`} target="_blank" rel="noopener noreferrer">
          <div className="card">
            <div className="wrapper">
              <img
                src={process.env.PUBLIC_URL + `/assets/characters/${getSpecialCaseImageSrc(character.name) || 'UI_AvatarIcon_' + getSpecialCharacterName}.png`}
                alt={character.name}
                className="cover-image"
              />
            </div>
            <div className="character-name">{character.name}</div>
            <img
              src={process.env.PUBLIC_URL + `/assets/characters/character-${character.name.toLowerCase().replace(/\s+/g, '-')}-card.png`}
              alt={character.name}
              className="character"
            />
          </div>
        </a>
      );
    }
  })}
</div>






      </div>
      <Footer />
    </div>
  );
};

export default HomePage;