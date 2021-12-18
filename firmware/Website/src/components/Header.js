import React from 'react';
import './CSS/Header.css';
import { Link } from 'react-router-dom';




class Header extends React.Component {
  render() {
    return <header className="App-header">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
    </header>
  }
}

/*
 * Render the above component into the div#app
 */
export default Header;