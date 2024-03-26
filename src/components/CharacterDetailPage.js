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
    }, [ characterName ]);
    
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
  
  const convertCharacterNameToImageFormat = (characterName) => {
    switch (characterName) {
      case 'Aether':
        return 'PlayerBoy';
      case 'Alhaitham':
        return 'Alhatham';
      case 'Amber':
        return 'Ambor';
      case 'Arataki Itto':
        return 'Itto';
      case 'Baizhu':
        return 'Baizhuer';
      case 'Hu Tao':
        return 'Hutao';
      case 'Jean':
        return 'Qin';
      case 'Kaedehara Kazuha':
        return 'Kazuha';
      case 'Kamisato Ayaka':
        return 'Ayaka';
      case 'Kamisato Ayato':
        return 'Ayato';
      case 'Kirara':
        return 'Momoka';
      case 'Kujou Sara':
        return 'Sara';
      case 'Kuki Shinobu':
        return 'Shinobu';
      case 'Lumine':
        return 'PlayerGirl';
      case 'Lynette':
        return 'Linette';
      case 'Lyney':
        return 'Liney';
      case 'Noelle':
        return 'Noel';
      case 'Raiden Shogun':
        return 'Shougun';
      case 'Sangonomiya Kokomi':
        return 'Kokomi';
      case 'Shikanoin Heizou':
        return 'Heizo';
      case 'Thoma':
        return 'Tohma';
      case 'Yae Miko':
        return 'Yae';
      case 'Yanfei':
        return 'Feiyan';
      case 'Yun Jin':
        return 'Yunjin';
      case 'Xianyun':
        return 'Liuyun';
      default:
        // For all other cases, just remove spaces and convert to lowercase
        return characterName.replace(/\s+/g, '');
    }
  };
  
// Helper function to get the talent image based on weapon type and talent type
const getTalentImage = (weaponType, talentType, characterName) => {
  const talentTypeMap = {
    NORMAL_ATTACK: "Skill_A",
    ELEMENTAL_SKILL: "Skill_S",
    ELEMENTAL_BURST: "Skill_E"
  };

  // Convert character name to match image format
  const characterNameForImage = convertCharacterNameToImageFormat(characterName);

  let talentImagePrefix;
  if (talentType === "ELEMENTAL_SKILL") {
    // Elemental Skill talent image
    talentImagePrefix = "Skill_S";
    const imagePath = `/assets/talents/${talentImagePrefix}_${characterNameForImage}_01.png`;
    return imagePath;
  } else if (talentType === "ELEMENTAL_BURST") {
    // Elemental Burst talent image
    talentImagePrefix = "Skill_E";
    const imagePath = `/assets/talents/${talentImagePrefix}_${characterNameForImage}_01_HD.png`;
    return imagePath;
  }

  // For Normal Attack talent image
  let weaponPrefix;
  switch (weaponType) {
    case "sword":
      weaponPrefix = "01";
      break;
    case "bow":
      weaponPrefix = "02";
      break;
    case "polearm":
      weaponPrefix = "03";
      break;
    case "claymore":
      weaponPrefix = "04";
      break;
    case "catalyst":
      return `/assets/talents/Skill_A_Catalyst_MD.png`;
    default:
      weaponPrefix = "01"; // Default to sword if weapon type is unknown
  }

  return `/assets/talents/${talentTypeMap[talentType]}_${weaponPrefix}.png`;
};

const getPassiveTalentImage = (characterName, talent) => {
  if (!talent) {
    return ""; // Return default image URL or handle it as needed
  }

  // Check unlock condition
  if (talent.unlock === "Unlocked at Ascension 1") {
    return `/assets/talents/UI_Talent_S_${convertCharacterNameToImageFormat(characterName)}_05.png`;
  } else if (talent.unlock === "Unlocked at Ascension 4") {
    return `/assets/talents/UI_Talent_S_${convertCharacterNameToImageFormat(characterName)}_06.png`;
  } else {
    // Check description for additional conditions
    if (talent.description.includes("Decreases all party members' gliding Stamina Consumption")) {
      return "/assets/talents/UI_Talent_Explosion_Glide.png";
    } else if (talent.description.includes("Weapon Ascension Materials, he has a 10% chance to receive double the product.")) {
      return "/assets/talents/UI_Talent_Combine_Weapon_Double.png";
    }
    
    // For other unlock conditions, handle them accordingly
    // You can add more conditions here as needed
    return ""; // Return default image URL or handle it as needed
  }
};

// Define function to get constellation image URL
const getConstellationImage = (characterName, constellation) => {
  const constellationIndex = constellation.level - 1; // Adjust level to array index
  let imageUrl;

  // Ensure consistent character name formatting
  const formattedCharacterName = convertCharacterNameToImageFormat(characterName);

  // Construct image URL based on constellation type and index
  switch (constellationIndex) {
      case 0:
          imageUrl = `/assets/constellations/UI_Talent_S_${formattedCharacterName}_01.png`; // 1st constellation
          break;
      case 1:
          imageUrl = `/assets/constellations/UI_Talent_S_${formattedCharacterName}_02.png`; // 2nd constellation
          break;
      case 2:
          imageUrl = `/assets/constellations/UI_Talent_U_${formattedCharacterName}_01.png`; // 3rd constellation
          break;
      case 3:
          imageUrl = `/assets/constellations/UI_Talent_S_${formattedCharacterName}_03.png`; // 4th constellation
          break;
      case 4:
          imageUrl = `/assets/constellations/UI_Talent_U_${formattedCharacterName}_02.png`; // 5th constellation
          break;
      case 5:
          imageUrl = `/assets/constellations/UI_Talent_S_${formattedCharacterName}_04.png`; // 6th constellation
          break;
      default:
          imageUrl = ''; // Default image URL
  }
  return imageUrl;
};

  return (
    <div className="character-detail-wrapper">
      <NavMenu />
      <div className="character-detail-container">
      <h2>{character.name}</h2>
      <div className="character-header" style={{ backgroundImage: `url('/assets/constellations/Eff_UI_Talent_${convertCharacterNameToImageFormat(character.name)}.png')` }}>
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
            const artifactName = artifact.trim(); // Remove any leading/trailing spaces
            const matchedArtifact = artifacts.find(item => item.name === artifactName);
            if (!matchedArtifact) {
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
            </ul>
          </div>
        )}
<div className="character-section">
  <h3>Talents:</h3>
  {character.skillTalents && character.skillTalents.map((talent, index) => (
    <div key={index} className="talent">
      <h4>{talent.name}</h4>
      {characterName && (
        <img src={getTalentImage(character.weapon, talent.type, convertCharacterNameToImageFormat(characterName))} alt={talent.type} />
      )}
      <p>{talent.description}</p>
    </div>
  ))}
</div>

<div className="character-section">
  <h3>Passive Talents:</h3>
  {character.passiveTalents && character.passiveTalents.map((talent, index) => (
    <div key={index} className="passive-talent">
      <h4>{talent.name}</h4>
      {/* Get corresponding passive talent image */}
      <img src={getPassiveTalentImage(character.name, talent)} alt={talent.name} />
      <p>{talent.description}</p>
    </div>
  ))}
</div>

<div className="character-section">
    <h3>Constellations:</h3>
    {character.constellations && character.constellations.map((constellation) => (
        <div key={constellation.name} className="constellation">
            <h4>{constellation.name}</h4>
            {/* Get corresponding constellation image */}
            <img src={getConstellationImage(character.name, constellation)} alt={constellation.name} />
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
  
  

