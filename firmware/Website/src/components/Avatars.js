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
        <img src="https://media.discordapp.net/attachments/836486407286816789/906311679955062784/636A1139-A796-4F77-B062-D8D5088E68D9_1_201_a.jpeg?width=840&height=1120" alt="student picture" class="picture" />
        <div class="studentName">Jeremiah Weber</div>
        <div class="StudentInfo">
          <a href="mailto: weberj0@email.arizona.edu"> weberj0@email.arizona.edu</a>
        </div>
      </div>
      <div class="student" id="spencer">
        <img src="https://media-exp1.licdn.com/dms/image/C5603AQHx46xObnGpIA/profile-displayphoto-shrink_800_800/0/1614543300205?e=1641427200&v=beta&t=VMI811puZsUJNG1yeoorZHF8aVhVD4Pu3mkqaefYvP8" alt="student picture" class="picture" />
        <div class="studentName">Spencer Scher</div>
        <div class="StudentInfo">
          <a href="mailto: sscher777@email.arizona.edu"> sscher777@email.arizona.edu</a>
        </div>
      </div>
      <div class="student">
        <img src="https://media.discordapp.net/attachments/905578823960133642/906316625106591754/Simon_project_photo.jpg?width=1206&height=1119" alt="student picture" class="picture" />
        <div class="studentName">Wei-Hsiang Chin</div>
        <div class="StudentInfo">
          <a href="mailto: simonchin@email.arizona.edu"> simonchin@email.arizona.edu</a>
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