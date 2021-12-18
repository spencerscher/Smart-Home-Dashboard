import React, { Component } from 'react';
import Header from './Header';
import RegisterForm from './RegisterForm'

class RegisterPage extends Component {
    render() {
        return (
            <div>
              <Header/>
              <RegisterForm/>
            </div>
        );
    }
}

export default RegisterPage;