/*
 * A simple React component
 */
import React from 'react';
import './CSS/Avatars.css';




class Avatars extends React.Component {

  // Hacky way to hide and show components in react without using state :)
  // hide = () => {
  //   const students = document.getElementById('spencer');

  //       // name.style = "border: 2px solid red;";
  //       students.style = "display: none";
  //   }
  
  render() {
    return <div className="mainContent">
      <div class="student">
        <img src="https://www.drivetest.de/wp-content/uploads/2019/08/drivetest-avatar-m-254x300.png" alt="student picture" class="picture" />
        <div class="studentName">Name Here</div>
        <div class="StudentInfo">
          <a href="mailto: test@gmail.com"> test@gmail.com</a>
        </div>
      </div>
      <div class="student" id="spencer">
      <img src="https://www.drivetest.de/wp-content/uploads/2019/08/drivetest-avatar-m-254x300.png" alt="student picture" class="picture" />
        <div class="studentName">Name Here</div>
        <div class="StudentInfo">
          <a href="mailto: test@gmail.com"> test@gmail.com</a>
        </div>
      </div>
      <div class="student">
      <img src="https://www.drivetest.de/wp-content/uploads/2019/08/drivetest-avatar-m-254x300.png" alt="student picture" class="picture" />
        <div class="studentName">Name Here</div>
        <div class="StudentInfo">
          <a href="mailto: test@gmail.com"> test@gmail.com</a>
        </div>
      </div>
      <div class="description">
        This smart home application is a low-cost IoT enabled web application for a) monitoring temperature and humidity, b) controlling a thermostat and a lighting system, and c) simulating power consumption, a simple security system, and others.
        The IoT device uses two photoresistors and a humidity & temperature sensor (DHT11)
        The IoT device will transmit measurements to a web application so that users can monitor their home
        A simulated clock will be used for this project
        The web application uses responsive design to allow users to view the application seamlessly on desktop, tablet, and mobile devices.
      </div>
    </div>
    
  }
}

/*
 * Render the above component into the div#app
 */
export default Avatars;