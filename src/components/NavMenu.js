// NavMenu.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavMenu.css';

const NavMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    const burgerMenu = document.querySelector(".menu-icon");
    const src = burgerMenu.getAttribute('src');
    const iconName = src === '/assets/icons/burger-menu.svg' ? '/assets/icons/close.svg' : '/assets/icons/burger-menu.svg';

    burgerMenu.setAttribute('src', iconName);

    const navigation = document.querySelector('.navigation');
    navigation.classList.toggle('navigation--mobile');

    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="NavMenu">
      <div className="menu__wrapper">
        <div className="menu__bar">
          <Link to="/" title="Logo">
            <img
              className="logo"
              src="/assets/icons/logo.png"
              title="Logo"
              alt="Logo"
            />
          </Link>
          <img
            className="menu-icon"
            src={isMenuOpen ? '/assets/icons/close.svg' : '/assets/icons/burger-menu.svg'}
            title={isMenuOpen ? 'Close Menu' : 'Open Menu'}
            alt={isMenuOpen ? 'Close Menu' : 'Open Menu'}
            onClick={toggleMenu}
          />
          <ul className={`navigation ${isMenuOpen ? 'navigation--mobile' : ''}`}>
            <li><Link to="/">Characters</Link></li>
            <li><Link to="/teams">Teams</Link></li>
            <li><Link to="/tierlist">Tier List</Link></li>
            <li><Link to="/farming">Farming</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavMenu;
