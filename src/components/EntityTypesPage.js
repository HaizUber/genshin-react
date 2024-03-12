import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://genshin.jmp.blue';

function EntityTypesPage() {
  const [entityTypes, setEntityTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntityTypes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/`);
        setEntityTypes(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEntityTypes();
  }, []);

  return (
    <div className="EntityTypesPage">
      <h1>List of Available Entity Types</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {entityTypes.map((entityType, index) => (
          <li key={index}>{entityType}</li>
        ))}
      </ul>
    </div>
  );
}

export default EntityTypesPage;
