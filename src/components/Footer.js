import React from 'react';
import '../styles/Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <section>
      <footer className="top">
        <img src="/assets/icons/logo.png" alt="Logo" />
        <div className="links">
          <div className="links-column">
          <h2>Resources</h2>
            <a href="#">API</a>
            <a href="#">Data References</a>
            <a href="#">Github Repo</a>
            <a href="#">License</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div className="links-column">
          <h2>Disclaimer  </h2>
            <p>        
            GenshinBuddy is not endorsed by miHoYo Co Ltd. and does not reflect the views or opinions of MiHoyo or anyone officially involved in producing or managing Genshin Impact.
            </p>
          </div>
          <div className="links-column socials-column">
            <h2>Social Media</h2>
            <p>
            If anything is broken for you, feel free to contact me on
            </p>
            <div className="socials">
              <a className="fab fa-discord" href="#"></a>
              <a className="fab fa-instagram" href="#"></a>
              <a className="fab fa-twitter" href="#"></a>
            </div>
          </div>
        </div>
      </footer>
      <footer className="bottom">
        <p className="copyright">© 2023 GenshinBuddy All rights reserved</p>
      </footer>
    </section>
  );
};

export default Footer;
