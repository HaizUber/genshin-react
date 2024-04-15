  import React, { useState, useEffect, useRef} from 'react';
  import { useParams } from 'react-router-dom';
  import { getCharacterDetail, getAlternativeResponse } from '../api/genshinApi';
  import '../styles/characterDetailPage.css'; // Import the CSS file
  import NavMenu from './NavMenu';
  import CharacterNavMenu from './characterNavmenu'; 
  import Footer from './Footer';
  import characterBuilds from '../data/characterbuilds.json'; // Import the character builds
  import quotes from '../data/quotes.json';
  import YouTube from 'react-youtube';

  const CharacterDetailPage = () => {
    const { characterName } = useParams();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weaponImages, setWeaponImages] = useState([]);
    const [weaponRarities, setWeaponRarities] = useState([]);
    const [artifacts, setArtifacts] = useState([]);
    const [upgradeMaterials, setUpgradeMaterials] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [quote, setQuote] = useState('');
    const [weaponData, setWeaponData] = useState([]);
    const playerRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
      const fetchCharacterDetail = async () => {
          try {
              setLoading(true);

              // Special case for "Kamisato Ayaka": return "Ayaka" instead
              let firstName = characterName;
              if (characterName === 'Kamisato-Ayaka') {
                  firstName = 'Ayaka';
              } else if (characterName === 'Kamisato-Ayato') {
                  firstName = 'Ayato';
              } else {
                  // Extract the first word from the character name
                  firstName = characterName.split(' ')[0];
              }
              

              // Fetch character data from the first endpoint
              const characterData = await getCharacterDetail(firstName);

              // Simulate delay for loading
              setTimeout(async () => {
                  // Fetch additional data including ascension costs from the second endpoint
                  const alternativeData = await getAlternativeResponse(firstName);

                  // Merge the additional data into the character data
                  const characterWithCosts = {
                      ...characterData,
                      ...alternativeData // Assuming all data from the second endpoint is needed
                  };

                  setCharacter(characterWithCosts);
                  setLoading(false); // Set loading to false after filtering
              }, 2000); // Simulate 2 seconds delay
                  // Choose a random quote
                  const randomIndex = Math.floor(Math.random() * quotes.length);
                  const randomQuote = quotes[randomIndex].quote;
                  const randomCharacter = quotes[randomIndex].character;
                  setQuote(`${randomQuote} ~${randomCharacter}`);
          } catch (error) {
              setError(error.message);
              setLoading(false); // Set loading to false in case of error
          }
      };

      fetchCharacterDetail(); // Invoke the fetchCharacterDetail function
  }, [characterName]); // Run the effect whenever characterName changes

    
    useEffect(() => {
      if (character) {
        // Fetch weapon images, rarities, and data
        const weapons = characterBuilds[characterName].weapons;

        Promise.all(
          weapons.map(weapon =>
            fetch(
              `https://genshin-db-api.vercel.app/api/weapons?query=${encodeURIComponent(weapon)}&matchAliases=true&matchCategories=true&verboseCategories=true`
            )
              .then((response) => response.json())
              .then((data) => ({
                nameicon: data.images.nameicon,
                rarity: data.rarity,
                baseatk: data.baseatk,
                substat: data.substat,
                effect: data.effect,
              })) // Extract nameicon, rarity, baseatk, substat, and effect
              .then((result) => {
                return result;
              })
              .catch((error) => {
                console.error('Error fetching weapon data:', error); // Log error if fetch fails
                return null; // Return null if there's an error to maintain order
              })
          )
        ).then((results) => {
          // Filter out any null values
          const filteredResults = results.filter((result) => result !== null);
          const nameIcons = filteredResults.map((result) => result.nameicon);
          const rarities = filteredResults.map((result) => result.rarity);
          setWeaponData(filteredResults); // Update weaponData state
          setWeaponImages(nameIcons);
          setWeaponRarities(rarities);
        });
      }
    }, [character, characterName]);

    
    useEffect(() => {
      const fetchArtifactData = async () => {
        try {
          const artifactNames = Object.values(characterBuilds[characterName].artifacts).flat().map(name => name.split(" ")[0]);
    
          // Fetch artifact data for each artifact name
          const artifactPromises = artifactNames.map(async artifactName => {
            const response = await fetch(`https://genshin-db-api.vercel.app/api/artifacts?query=${encodeURIComponent(artifactName)}`);
            const data = await response.json();
    
            // Check if 'data' exists and contains the necessary information
            if (data && data.name && data.images && data.images.nameflower) {
              const artifactData = {
                name: data.name,
                imageSrc: `/assets/artifacts/${data.images.nameflower}.png`,
                '2pc': data['2pc'], // Include the 2pc effect
                '4pc': data['4pc'] // Include the 4pc effect
              };
              return artifactData;
            } else {
              return null; // Or handle the case when no data is found
            }
          });
    
          // Resolve all artifact promises
          const fetchedArtifacts = await Promise.all(artifactPromises);
    
          setArtifacts(fetchedArtifacts.filter(artifact => artifact !== null)); // Filter out null values
        } catch (error) {
          console.error('Error fetching artifact data:', error);
        }
      };
      fetchArtifactData();
    }, [characterName]);
    

  // Declare getUpgradeMaterialImageSrc function before the useEffect hook
  const getUpgradeMaterialImageSrc = (materialId) => {
    return `/assets/materials/${materialId}.png`;
  };

  // Inside the existing useEffect hook
  useEffect(() => {
    const fetchUpgradeMaterialsData = async () => {
      try {
        // Get the list of upgrade materials for the character
        const upgradeMaterials = characterBuilds[characterName].materials;

        // Fetch material data for each upgrade material
        const upgradeMaterialPromises = upgradeMaterials.map(async material => {
          const response = await fetch(`https://genshin-db-api.vercel.app/api/materials?query=${encodeURIComponent(material)}&matchAliases=true&matchCategories=true&verboseCategories=true`);
          const data = await response.json();


          // Check if 'data' exists and contains the necessary information
          if (data && data.id && data.images && data.images.nameicon) {
            const upgradeMaterialData = {
              id: data.id,
              name: data.name,
              imageSrc: getUpgradeMaterialImageSrc(data.images.nameicon),
              dropdomain: data.dropdomain,
              daysofweek: data.daysofweek,
              source: data.source
            };
            return upgradeMaterialData;
          } else {
            return null; // Or handle the case when no data is found
          }
        });

        // Resolve all upgrade material promises
        const fetchedUpgradeMaterials = await Promise.all(upgradeMaterialPromises);

        setUpgradeMaterials(fetchedUpgradeMaterials.filter(material => material !== null)); // Filter out null values
      } catch (error) {

      }
    };
    fetchUpgradeMaterialsData();
  }, [characterName]);

  useEffect(() => {
    const handleScroll = () => {
        setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);
    
  const backgroundPositionY = `${scrollPosition * 0.5}px`; // Adjust the scroll speed as needed
      
  if (loading) {
    return (
      <>
        <div className="loader"></div>
        <div className="quote">{quote}</div>
      </>
    );
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
          case 'Arataki-Itto':
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
              // If the name contains spaces, remove the first word, remove spaces, replace hyphens with empty string, and convert to lowercase
              if (characterName.includes(' ')) {
                  const remainingName = characterName.split(' ').slice(1).join('');
                  return remainingName.replace(/\s+/g, '').replace('-', '');
              } else {
                  // Return the original character name if not found and does not contain spaces
                  return characterName;
              }
      }
  };

  const getTalentImage = (weaponType, talentType, characterName) => {

    const talentTypeMap = {
      NORMAL_ATTACK: "Skill_A",
      ELEMENTAL_SKILL: "Skill_S",
      ELEMENTAL_BURST: "Skill_E",
      RIGHT_CLICK: "UI_Talent_S" // Update to match the talent type from API response
    };

    // Get the talent image prefix based on the talent type
    let talentImagePrefix;
    if (talentTypeMap.hasOwnProperty(talentType)) {
      talentImagePrefix = talentTypeMap[talentType];
    } else {
      talentImagePrefix = "UI_Talent_S"; // Default to UI_Talent_S if talent type is not specified
    }

    // Construct the talent image path based on talent type
    let imagePath;
    if (talentType === "NORMAL_ATTACK") {
      // Determine the weapon prefix based on the weapon type for normal attack
      let weaponPrefix = "01"; // Default to sword if weapon type is unknown
      if (weaponType) {
        switch (weaponType) {
          case "Sword":
            weaponPrefix = "01";
            break;
          case "Bow":
            weaponPrefix = "02";
            break;
          case "Polearm":
            weaponPrefix = "03";
            break;
          case "Claymore":
            weaponPrefix = "04";
            break;
          case "Catalyst":
            return `/assets/talents/Skill_A_Catalyst_MD.png`;
          default:
            break; // No need to change the weapon prefix for other talent types
        }
      }
      imagePath = `/assets/talents/Skill_A_${weaponPrefix}.png`;
    } else if (talentType === "ELEMENTAL_BURST" || !talentTypeMap.hasOwnProperty(talentType)) {
      // Convert character name to match image format
      const formattedCharacterName = convertCharacterNameToImageFormat(characterName);
      const suffix = talentType === "ELEMENTAL_BURST" ? "_01_HD" : "_05"; // Determine the suffix based on talent type
      imagePath = `/assets/talents/${talentImagePrefix}_${formattedCharacterName}${suffix}.png`;
    } else {
      // Convert character name to match image format
      const formattedCharacterName = convertCharacterNameToImageFormat(characterName);
      imagePath = `/assets/talents/${talentImagePrefix}_${formattedCharacterName}_01.png`;
    }
    return imagePath;
  };

  const getPassiveTalentImage = (characterName, talent) => {
    if (!talent) {
        return ""; // Return default image URL or handle it as needed
    }

    // Convert character name to match image format
    const formattedCharacterName = convertCharacterNameToImageFormat(characterName);

    // Check unlock condition
    if (talent.unlock === "Unlocked at Ascension 1") {
        return `/assets/talents/UI_Talent_S_${formattedCharacterName}_05.png`;
    } else if (talent.unlock === "Unlocked at Ascension 4") {
        return `/assets/talents/UI_Talent_S_${formattedCharacterName}_06.png`;
    } else {
        // Check description for additional conditions
        if (talent.description.includes("Decreases all party members' gliding Stamina Consumption")) {
            return "/assets/talents/UI_Talent_Explosion_Glide.png";
          } else if (talent.description.includes("Weapon Ascension Materials") && talent.description.includes("10% chance")) {
            return "/assets/talents/UI_Talent_Combine_Weapon_Double.png";      
        } else if (talent.description.includes("When a party member uses attacks to obtain wood from a tree, they have a 25% chance to get an additional log of wood.")) {
            return "/assets/talents/UI_Talent_S_Itto_07.png";
      }

        // For other unlock conditions, handle them accordingly
        // You can add more conditions here as needed
        return ""; // Return default image URL or handle it as needed
    }
  };

  const getConstellationImage = (characterName, constellation) => {
    const constellationIndex = constellation.level - 1; // Adjust level to array index

    // Convert character name to match image format
    const formattedCharacterName = convertCharacterNameToImageFormat(characterName);

    let imageUrl;

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
  const handleReady = (event) => {
    event.target.mute(); // Mute the video when it's ready
    event.target.playVideo(); // Autoplay the video
    playerRef.current = event.target; // Save the player reference
};
const handleStateChange = (event) => {
  if (event.data === window.YT.PlayerState.ENDED) {
      event.target.seekTo(0);
      event.target.playVideo();
  }
}
const toggleMute = () => {
    setIsMuted(prevIsMuted => !prevIsMuted); // Toggle the muted state
    const player = playerRef.current;
    if (player) {
        if (!isMuted) { // Check the updated state value from setIsMuted
            player.unMute(); // Unmute the video
        } else {
            player.mute(); // Mute the video
        }
    }
};
let videoid;
const characterData = characterBuilds[characterName];
if (characterData && characterData.videoid) {
    videoid = characterData.videoid;
    console.log(weaponRarities)
    // Now you can use videoid safely
} else {
    console.error("Video id is undefined for character:", characterName);
    // Handle the case where video id is undefined
}


  return (
    <div className="character-detail-wrapper">
      {/* Character Detail */}
      <NavMenu />
      <CharacterNavMenu />
      {/* Character Detail Container */}
      <div
        className="character-detail-container"
        style={{
          backgroundImage: `url('/assets/constellations/Eff_UI_Talent_${convertCharacterNameToImageFormat(
            character.name
          )}.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '250px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          animationName: 'fadeIn',
          animationDuration: '1s',
          animationFillMode: 'both',
          backgroundPositionY: backgroundPositionY,
        }}
      >
  <div className="character-detail-container">

  <div className="character-header">
      <div className="video-container">
        <YouTube
          videoId={videoid}
          opts={{
            width: '1050',
            height: '600',
            playerVars: {
              autoplay: 1,
              loop: 1,
              modestbranding: 1,
              controls: 0,
              cc_lang_pref: 'en', // Set the language preference for subtitles
              cc_load_policy: 1, // Enable closed captions by default
            }
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
        />
      </div>
    </div>
    <button className="mute-button" onClick={toggleMute}>
  {isMuted ? (
    <img src="/assets/icons/unmute.png" alt="Unmute" className="mute-icon" />
  ) : (
    <img src="/assets/icons/mute.png" alt="Mute" className="mute-icon" />
  )}
</button>
      <div className="character-info">
      <img
        src={`/assets/characters/${getSpecialCaseImageSrc(character.name)}.png`}
        alt={character.name}
      />
          <div className="info-item">
              <h3>Name:</h3>
              <h2>{character.name}</h2>
          </div>
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

  {/* Upgrade Materials */}
  <div id="upgrade-materials" className="character-section">
    <h3>Upgrade Materials:</h3>
    <div className="upgrade-materials">
      {upgradeMaterials.map((material, index) => {
        // Filter out "Recommendation: Found in" and "Recommendation:" from source recommendations
        const filteredSource = material.source ? material.source.map(source => source.replace('Recommendation: Found in', '').replace('Recommendation:', '')).join(', ') : '';

        // Concatenate multiple source recommendations into a single line
        const sourceRecommendations = filteredSource.replace(/,([^,]*)$/, ' or$1');
        return (
          <div key={index} className="upgrade-materials-item" data-dropdomain={material.dropdomain ? `${material.dropdomain} on ${material.daysofweek ? material.daysofweek.join(', ') : ''}` : ''} data-source={sourceRecommendations}>
            <img src={material.imageSrc} alt={material.name} />
            <p>{material.name}</p>
          </div>
        );
      })}
    </div>
  </div>


        {/* Character Build */}
        {characterBuilds[character.name] && (
          <div id="character-build" className="character-build">
            <h4>Character Build:</h4>
            <ul>
  {/* Display weapons */}
  <li className="build-item">
    <h4>Weapons</h4>
    <ul className="build-sublist">
      {characterBuilds[character.name].weapons.map((weapon, index) => (
        <li key={index}>
          <div className="weapon-info">
            <div className="tooltip">
              <img 
                src={`/assets/weapons/${weaponImages[index]}.png`} 
                alt={weapon} 
                className={`weapon-image ${
                  weaponData[index]?.rarity === '5' 
                    ? 'weapon-image-5star' 
                    : weaponData[index]?.rarity === '3' 
                    ? 'weapon-image-3star' 
                    : 'weapon-image-4star'
                }`}
              />
              <span className="tooltiptext">
                <div className="tooltip-content">
                  <div className="tooltip-image">
                    <img 
                      src={`/assets/weapons/${weaponImages[index]}.png`} 
                      alt={weapon} 
                      className={`tooltip-image ${
                        weaponData[index]?.rarity === '5' 
                          ? 'weapon-image-5star' 
                          : weaponData[index]?.rarity === '3' 
                          ? 'weapon-image-3star' 
                          : 'weapon-image-4star'
                      }`} 
                    />
                  </div>
                  <div className="weapon-details">
                    <strong>{weapon}</strong><br/>
                    <strong>Base ATK:</strong> {weaponData[index]?.baseatk}<br/>
                    <strong>Substat:</strong> {weaponData[index]?.substat}<br/>
                  </div>
                  <div className="weapon-effect">
                    <strong>Effect:</strong> {weaponData[index]?.effect}
                  </div>
                </div>
              </span>
            </div>
            <p>{weapon}</p>
          </div>
        </li>
      ))}
    </ul> 
  </li>



  {/* Display artifacts */}
  <div id="artifacts" className="character-section artifacts">
    <h3>Artifacts:</h3>
    <div className="artifacts-wrapper">
      {Object.entries(characterBuilds[character.name].artifacts).map(([setName, setItems], setIndex) => (
        <div key={setIndex} className="artifact-set">
          <div className="artifact-items">
            {setItems.map((artifact, index) => {
              const artifactName = artifact.trim(); // Remove any leading/trailing spaces
              const matchedArtifact = artifacts.find(item => item.name === artifactName);
              if (!matchedArtifact) {
                return null; // Skip rendering if artifact is not found
              }
              // Extracting the number from the set name
              const setNumber = setName.match(/\d+/)[0];
              return (
                <div key={index} className="artifact-item">
                  <div className="tooltip">
                    <img src={matchedArtifact.imageSrc} alt={artifactName} className="artifact-image" />
                    <span className="tooltiptext">
                      <div className="tooltip-content">
                        <div className="tooltip-image">
                          <img src={matchedArtifact.imageSrc} alt={artifactName} className="tooltip-image" />
                        </div>
                        <div className="artifact-details">
                          <strong>{artifactName}</strong><br/>
                          <strong>2pc:</strong> {matchedArtifact['2pc']}<br/><br></br>
                          <strong>4pc:</strong> {matchedArtifact['4pc']}
                        </div>
                      </div>
                    </span>
                  </div>
                  <div className="artifact-number">{setNumber}</div>
                  <p>{artifactName}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>



              {/* Display main stats */}
              <li className="build-item">
                <h4>Main Stats</h4>
                <ul className="build-sublist">
                  {Object.entries(characterBuilds[character.name].main_stats).map(([stat, value]) => (
                    <li key={stat}>{stat}: {value}</li>
                  ))}
                </ul>
              </li>

              {/* Display substats */}
              <li className="build-item">
                <h4>Substats</h4>
                <ul className="build-sublist">
                  {characterBuilds[character.name].substats.map((substat, index) => (
                    <li key={index}>{index + 1}: {substat}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        )}

{/* Display Talents */}
<div id="talents" className="character-section">
  <h3>Talents:</h3>
  {character.skillTalents && character.skillTalents.map((talent, index) => (
    <div key={index} className="talent">
      <h4>
        <img src={`/assets/talents/${talent.name.replace(/:/g, '')}.webp`} alt="Animated WebP" className="webp-gif" /> <br></br>
        {talent.name}
      </h4>
      {character.name && (
        <img src={getTalentImage(character.weapon, talent.type, character.name)} alt={talent.type} />
      )}
      <p>{talent.description}</p>
    </div>
  ))}
</div>





        {/* Display Passive Talents */}
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

        {/* Display Constellations */}
        <div id="constellations" className="character-section">
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

        <div id="ascension" className="character-section">
    <h3>Ascension Costs:</h3>
    <table>
      <thead>
        <tr>
          <th>Ascension Level</th>
          <th>Material Name</th>
          <th>Material Amount</th>
        </tr>
      </thead>
      <tbody>
        {character && character.costs && Object.entries(character.costs).map(([ascendLevel, items]) => (
          items.map((item, index) => (
            <tr key={`${ascendLevel}-${index}`}>
              {index === 0 && <td rowSpan={items.length}>Ascension Level {ascendLevel.slice(-1)}</td>}
              <td>
                <img className="material-image" src={getMaterialImageSrc(item.id)} alt={item.name} /> {item.name}
              </td>
              <td>{item.count}</td>
            </tr>
          ))
        ))}
      </tbody>
    </table>
  </div>
      </div>

      <Footer />
    </div>
  );
                };
  export default CharacterDetailPage;