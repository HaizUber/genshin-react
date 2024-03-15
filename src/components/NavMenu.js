// NavMenu.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavMenu.css';

const NavMenu = () => {
  return (
    <nav className="NavMenu">
      <ul>
        <li><Link to="/">Characters</Link></li>
        <li><Link to="/teams">Teams</Link></li>
        <li><Link to="/tierlist">Tier List</Link></li>
        <li><Link to="/farming">Farming</Link></li>
      </ul>
    </nav>
  );
};

export default NavMenu;
