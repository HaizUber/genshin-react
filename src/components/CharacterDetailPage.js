import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEntityImage, fetchCharacterDetails } from '../api/genshinApi';

function CharacterDetailPage() {
  const { characterId } = useParams();
  const [characterDetails, setCharacterDetails] = useState(null);
  const [characterImage, setCharacterImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await fetchCharacterDetails(characterId);
        setCharacterDetails(details);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [characterId]);

  useEffect(() => {
    if (!characterDetails) return;

    const fetchImage = async () => {
      try {
        const imageData = await fetchEntityImage('characters', characterId, 'card');
        setCharacterImage(imageData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchImage();
  }, [characterDetails, characterId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!characterDetails || !characterImage) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{characterDetails.name}</h2>
      <img src={characterImage} alt={characterDetails.name} />
      <p>{characterDetails.description}</p>
      {/* Display other character details */}
    </div>
  );
}

export default CharacterDetailPage;
