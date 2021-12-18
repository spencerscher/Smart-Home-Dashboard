import React from 'react';
import './CSS/Header.css';
import { Link } from 'react-router-dom';
import $ from 'jquery';




class HomepageHeader extends React.Component {
  logout = () => {
    $.ajax({
      url: '/customers/status',
      method: 'GET',
      headers: { 'x-auth': window.localStorage.getItem("token") },
      dataType: 'json'
    })
      .done(function (data, textStatus, jqXHR) {
        localStorage.removeItem("token");
        window.location.replace("/");
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // window.location.replace("display.html");
      });
  }

render() {
  return <header className="App-header">
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link onClick={this.logout} to="/">Logout</Link></li>
        {/* <li><Link to="/register">Register</Link></li> */}
      </ul>
    </nav>
  </header>
}
}

/*
 * Render the above component into the div#app
 */
export default HomepageHeader;