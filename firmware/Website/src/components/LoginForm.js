import React, { Component } from 'react';
import './CSS/Register.css'
import $ from "jquery";

// document.getElementById("submit").addEventListener("click", function(event) {
//     checkForm();
//     event.preventDefault();
// });

class LoginForm extends Component {
    login = () => {


        let txdata = {
            email: $('#email').val(),
            password: $('#password').val()
        };

        $.ajax({
            url: '/customers/logIn',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
        .done(function (data, textStatus, jqXHR) {
            localStorage.setItem("token", data.token);
            window.location.replace("dashboard");
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            $('#errorMsg').html(JSON.stringify(jqXHR.responseJSON.msg, null, 2));
        });
    }

    render() {
        return (
            <div className="user">
                <header className="user__header">
                </header>
                <form className="form">
                    <label htmlFor="email"></label>
                    <input type="email" id="email" placeholder="Email" className="form_input" />
                    <label htmlFor="password"></label>
                    <input type="password" id="password" placeholder="Password" className="form_input" />
                    <input type="button" onClick={this.login} id="submit" value="Login" className="btn"></input>
                    <div id="errorMsg"></div>
                </form>
            </div>
        );
    }
}

export default LoginForm;