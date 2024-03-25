import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCharacterDetail } from '../api/genshinApi';
import '../styles/characterDetailPage.css'; // Import the CSS file
import NavMenu from './NavMenu';
import Footer from './Footer';
import characterBuilds from '../data/characterbuilds.json'; // Import the character builds
const CharacterDetailPage = () => {
  const { characterName } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [weaponImages, setWeaponImages] = useState([]);
   const [weaponRarities, setWeaponRarities] = useState([]);
   const [artifacts, setArtifacts] = useState([]);
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

  useEffect(() => {
    if (character) {
      // Fetch weapon images and rarities
      const weapons = characterBuilds[characterName].weapons;
  
      Promise.all(
        weapons.map(weapon => 
          fetch(`https://genshin-db-api.vercel.app/api/weapons?query=${encodeURIComponent(weapon)}&matchAliases=true&matchCategories=true&verboseCategories=true`)
            .then(response => response.json())
            .then(data => ({ nameicon: data.images.nameicon, rarity: data.rarity })) // Extract nameicon and rarity
            .catch(error => {
              console.error("Error fetching weapon data:", error);
              return null; // Return null if there's an error to maintain order
            })
        )
      ).then(results => {
        // Filter out any null values
        const filteredResults = results.filter(result => result !== null);
        const nameIcons = filteredResults.map(result => result.nameicon);
        const rarities = filteredResults.map(result => result.rarity);
  
        setWeaponImages(nameIcons);
        setWeaponRarities(rarities);
      });
    }
    }, [character, characterName]); 
  
    useEffect(() => {
      const fetchArtifactData = async () => {
        try {
          const artifactNames = Object.values(characterBuilds[characterName].artifacts).flat().map(name => name.split(" ")[0]);
          console.log("Artifact Names:", artifactNames);
        
          // Fetch artifact data for each artifact name
          const artifactPromises = artifactNames.map(async artifactName => {
            const response = await fetch(`https://genshin-db-api.vercel.app/api/artifacts?query=${encodeURIComponent(artifactName)}`);
            const data = await response.json();
            console.log("API Response:", data);
        
            // Check if 'data' exists and contains the necessary information
            if (data && data.name && data.images && data.images.nameflower) {
              const artifactData = {
                name: data.name,
                imageSrc: `/assets/artifacts/${data.images.nameflower}.png`
              };
              return artifactData;
            } else {
              console.error("No data or empty array in API response:", data);
              return null; // Or handle the case when no data is found
            }
          });
        
          // Resolve all artifact promises
          const fetchedArtifacts = await Promise.all(artifactPromises);
          console.log("Fetched Artifacts:", fetchedArtifacts);
          setArtifacts(fetchedArtifacts.filter(artifact => artifact !== null)); // Filter out null values
        } catch (error) {
          console.error('Error fetching artifact data:', error);
        }
      };
      
      
      
      
      
      
      
    
      fetchArtifactData();
    }, [characterBuilds, characterName]);
    
  
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
    <div className="character-detail-wrapper">
      <NavMenu />
      <div className="character-detail-container">
      <h2>{character.name}</h2>
        <div className="character-header">
          <img src={`/assets/characters/${getSpecialCaseImageSrc(characterName)}.png`} alt={characterName} />
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
            <h3>Nation:<p>{character.nation}</p></h3>
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
        </div>
               {/* Display character's specific build */}
               {characterBuilds[characterName] && (
          <div className="character-build">
            <h4>Character Build:</h4>
            <ul>
{/* Display weapons */}
<li>
    <h4>Weapons</h4>
    <ul>
        {characterBuilds[characterName].weapons.map((weapon, index) => (
            <li key={index}>
                <img src={`/assets/weapons/${weaponImages[index]}.png`} alt={weapon} className="weapon-image"/>
                {weapon} ({weaponRarities[index]}✩)
            </li>
        ))}
    </ul> 
</li>

{/* Display artifacts */}
<li className='artifact-list'>
  <h4>Artifacts</h4>
  <ul>
    {Object.entries(characterBuilds[characterName].artifacts).map(([setName, setItems], setIndex) => (
      <li key={setIndex}>
        <h5>{setName}</h5>
        <ul>
          {setItems.map((artifact, index) => {
            console.log("setName:", setName);
            console.log("artifact:", artifact);
            const artifactName = artifact.trim(); // Remove any leading/trailing spaces
            console.log("artifactName:", artifactName);
            const matchedArtifact = artifacts.find(item => item.name === artifactName);
            console.log("matchedArtifact:", matchedArtifact);
            if (!matchedArtifact) {
              console.log(`Artifact not found for name: ${artifactName}`);
              return null; // Skip rendering if artifact is not found
            }
            return (
              <li key={index}>
                {/* Display artifact image and name */}
                <>
                  <img src={matchedArtifact.imageSrc} alt={artifactName} className='artifact-image' />
                  {artifactName}
                </>
              </li>
            );
          })}
        </ul>
      </li>
    ))}
  </ul>
</li>
    
              {/* Display main stats */}
              <li>
                <h4>Main Stats</h4>
                <ul>
                  {Object.entries(characterBuilds[characterName].main_stats).map(([stat, value]) => (
                    <li key={stat}>{stat}: {value}</li>
                  ))}
                </ul>
              </li>

              {/* Display substats */}
              <li>
                <h4>Substats</h4>
                <ul>
                  {characterBuilds[characterName].substats.map((substat, index) => (
                    <li key={index}>{index + 1}: {substat}</li>
                  ))}
                </ul>
              </li>

              {/* Display talent priority */}
              <li>
                <h4>Talent Priority</h4>
                <ul>
                  {characterBuilds[characterName].talent_priority.map((talent, index) => (
                    <li key={index}>{index + 1}: {talent}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        )}
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
      <Footer />
    </div>
  );
};

export default CharacterDetailPage;
  
  

