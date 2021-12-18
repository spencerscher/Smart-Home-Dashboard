/*
 * A simple React component
 */
import React from 'react';
import './CSS/Homepage.css';
import './CSS/App.css';
import Text from './text.js'
import Header from './Header'
import Avatars from './Avatars';
import HomepageHeader from './HomepageHeader';
//import './Typing.css'


class Application extends React.Component {

  checkAuth = () => {
    if (window.localStorage.getItem("token")) {
        return <HomepageHeader />
    }
    else{
        return <Header />
    }
}
  constructor(props) {
    super(props);
    this.state = {
      animationClass: 'test'
    }
    this.changeState = this.changeState.bind(this);
  }

  changeState() {
    if (this.state.animationClass === 'test') {
      this.setState({
        animationClass: 'test paused'
      });
    } else {
      this.setState({
        animationClass: 'test'
      });
    }
  }
  render() {
    return <div className={this.state.animationClass}>
      <div className="App">
        <div className="container">
          {this.checkAuth()}
          <Text />
          <Avatars />
        </div>
      </div>
    </div>;

  }
}

/*
 * Render the above component into the div#app
 */
export default Application;