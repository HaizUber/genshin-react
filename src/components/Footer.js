// Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="footer-links">
        <Link to="/terms-of-use">Terms of Use</Link>
        <Link to="/cookies-policy">Cookies Policy</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/about-us">About Us</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <p className="disclaimer">

      GenshinBud is an independent platform and is not affiliated or associated with miHoYo/HoYoverse company. Instead, it operates as a dedicated resource for guides and character builds tailored to the game Genshin Impact. Our mission is to assist players by offering reliable and precise information to enhance their gaming experience.
      </p>
      <p className="copyright">© 2023 GENSHIN BUD.</p>
    </footer>
  );
};

export default Footer;
