// HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllCharacterNames } from '../api/genshinApi';
import quotes from '../data/quotes.json'; // Import quotes JSON file
import '../styles/HomePage.css';

const HomePage = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null);
  const [randomQuote, setRandomQuote] = useState(''); // State to store random quote
  const [quoteCharacter, setQuoteCharacter] = useState(''); // State to store the character of the quote

  useEffect(() => {
    const fetchCharactersData = async () => {
      try {
        const characterNames = await fetchAllCharacterNames();
        const charactersData = characterNames.map(name => {
          let imageUrl;
          if (name.startsWith('traveler')) {
            const travelerType = name.split('-')[1]; // Extract traveler type
            imageUrl = `https://genshin.jmp.blue/characters/traveler-${travelerType}/icon-big-lumine`;
          } else {
            imageUrl = `https://genshin.jmp.blue/characters/${name.toLowerCase().replace(/\s+/g, '-')}/icon-big`;
          }
          return {
            name,
            id: name.toLowerCase().replace(/\s+/g, '-'),
            imageUrl
          };
        });
        setCharacters(charactersData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCharactersData();

    // Event listener to detect when all resources are loaded
    window.onload = () => {
      setLoading(false); // Set loading to false when all resources are loaded
    };

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.onload = null;
    };
  }, []);

  useEffect(() => {
    // Timeout to hide the loader after 3 seconds, even if the resources haven't finished loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Cleanup function to clear the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  // Function to select a random quote and character
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const { quote, character } = quotes[randomIndex];
    return { quote, character };
  };

  useEffect(() => {
    // Set a random quote and character while loading
    const { quote, character } = getRandomQuote();
    setRandomQuote(quote);
    setQuoteCharacter(character);
  }, []);

  return (
    <div className="HomePage">
      {loading ? ( // If loading, display loader with random quote
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loading-text">"{randomQuote}" - {quoteCharacter}</p>
        </div>
      ) : ( // If not loading, display content
        <div className="site-content">
          <h1 style={{ color: 'blue' }}>Characters</h1>
          {error && <p>Error: {error}</p>}
          <div className="character-list">
            {characters.map((character) => (
              <Link key={character.id} to={`/characters/${character.id}`}>
                <div className="character-card" style={{ border: '1px solid black', padding: '10px', margin: '10px', textAlign: 'center' }}>
                  <img src={character.imageUrl} alt={character.name} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                  <p style={{ fontWeight: 'bold', marginTop: '5px' }}>{character.name}</p>
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
