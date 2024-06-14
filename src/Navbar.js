import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Groups</Link>
        </li>
        <li>
          <Link to="/concert">Concerts</Link>
        </li>
        <li>
          <Link to="/articales">Articales</Link>
        </li>
       
      </ul>
    </nav>
  );
}

export default Navbar;
