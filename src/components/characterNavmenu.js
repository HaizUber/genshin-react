import React from 'react';
import '../styles/characterNavmenu.css';

const CharacterNavMenu = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="character-nav-menu">
      <ul>
        <li>
          <button onClick={() => scrollToSection('upgrade-materials')}>
            <img src="/assets/talents/UI_Talent_S_Baizhuer_07.png" alt="Upgrade Materials" title="Upgrade Materials" />
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('character-build')}>
            <img src="/assets/talents/UI_Talent_S_Baizhuer_06.png" alt="Character Build" title="Character Build" />
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('talents')}>
            <img src="/assets/constellations/UI_Talent_S_Baizhuer_03.png" alt="Talents" title="Talents" />
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('constellations')}>
            <img src="/assets/constellations/UI_Talent_S_Mona_02.png" alt="Constellations" title="Constellations" />
          </button>
        </li>
        <li>
          <button onClick={() => scrollToSection('ascension')}>
            <img src="/assets/talents/UI_Talent_Collect_Ore.png" alt="Ascension Costs" title="Ascension Costs" />
          </button>
        </li>
        {/* Add more menu items as needed */}
      </ul>
    </nav>
  );
};

export default CharacterNavMenu;
