import React, { Component } from 'react';
import './CSS/Register.css'
import $ from "jquery";

// document.getElementById("submit").addEventListener("click", function(event) {
//     checkForm();
//     event.preventDefault();
// });

class RegisterForm extends Component {

    checkForm = () => {
        const name = document.getElementById('fullName');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const passwordConfirm = document.getElementById('passwordConfirm');
        const error = document.getElementById('formErrors');
        const form = document.querySelector('.form')
        const button = document.querySelector('.btn')
        let noErrors = false;

        if (!name.value) {
            noErrors = true;
            // name.style = "border: 2px solid red;";
            error.style = "display: block";
            const nameError = document.createElement("li");
            nameError.textContent = "Missing full name.";
            error.appendChild(nameError);
            form.classList.add('form--no');
        }
        if (!email.value || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/.test(email.value)) {
            noErrors = true;
            // email.style = "border: 2px solid red;";
            error.style = "display: block";
            const emailError = document.createElement("li");
            emailError.textContent = "Invalid or missing email address.";
            error.appendChild(emailError);
            form.classList.add('form--no');
        }
        if (password.value.length < 10 || password.value.length > 20) {
            noErrors = true;
            // password.style = "border: 2px solid red;";
            error.style = "display: block";
            const passwordError = document.createElement("li");
            passwordError.textContent = "Password must be between 10 and 20 characters.";
            error.appendChild(passwordError);
            form.classList.add('form--no');
        }
        if (!password.value || !password.value.trim() || !/[a-z]/.test(password.value)) {
            noErrors = true;
            // password.style = "border: 2px solid red;";
            error.style = "display: block";
            const passwordError2 = document.createElement("li");
            passwordError2.textContent = "Password must contain at least one lowercase character.";
            error.appendChild(passwordError2);
            form.classList.add('form--no');
        }
        if (!password.value || !password.value.trim() || !/[A-Z]/.test(password.value)) {
            noErrors = true;
            // password.style = "border: 2px solid red;";
            error.style = "display: block";
            const passwordError3 = document.createElement("li");
            passwordError3.textContent = "Password must contain at least one uppercase character.";
            error.appendChild(passwordError3);
            form.classList.add('form--no');
        }
        if (!password.value || !password.value.trim() || !/[0-9]/.test(password.value)) {
            noErrors = true;
            // password.style = "border: 2px solid red;";
            error.style = "display: block";
            const passwordError4 = document.createElement("li");
            passwordError4.textContent = "Password must contain at least one digit.";
            error.appendChild(passwordError4);
            form.classList.add('form--no');
        }
        if (passwordConfirm && password.value !== passwordConfirm.value) {
            noErrors = true;
            // password.style = "border: 2px solid red;";
            passwordConfirm.style = "border: 2px solid red;";
            error.style = "display: block";
            const passwordError5 = document.createElement("li");
            passwordError5.textContent = "Password and confirmation password don't match.";
            error.appendChild(passwordError5);
            form.classList.add('form--no');
        }
        if (noErrors === false) {
            

            let txdata = {
                fullName: $('#fullName').val(),
                email: $('#email').val(),
                password: $('#password').val(),
                zipCode: $('#zipCode').val()
              };
      
            $.ajax({
                url: '/customers/signUp',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(txdata),
                dataType: 'json'
            })
            .done(function (data, textStatus, jqXHR) {
                error.style = "display: none";
                name.style = "border: 1px solid #aaa;";
                email.style = "border: 1px solid #aaa;";
                password.style = "border: 1px solid #aaa;";
                passwordConfirm.style = "border: 1px solid #aaa;";
                if (data.success) {
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
                    });
                }
            })

            .fail(function (jqXHR, textStatus, errorThrown) {
                
                if (jqXHR.status == 404) {
                    const serverError = document.createElement("li");
                    serverError.textContent = "Server could not be reached!!!"; 
                    error.appendChild(serverError); 
                    form.classList.add('form--no');  
                }

                
                else{
                    const emailError = document.createElement("li");
                    emailError.textContent = JSON.stringify(jqXHR.responseJSON.msg, null, 2);
                    error.appendChild(emailError);  
                    form.classList.add('form--no');
                }
            });
        }
        
    };

    render() {
        return (
            <div className="user">
                <header className="user__header">
                    {/* <h1 className="user__title">Create Account</h1> */}
                </header>
                <form className="form">
                    <label htmlFor="fullName"></label>
                    <input type="text" id="fullName" placeholder="Full Name" className="form_input" />
                    <label htmlFor="email"></label>
                    <input type="email" id="email" placeholder="Email" className="form_input" />
                    <label htmlFor="zipCode"></label>
                    <input type="text" id="zipCode" placeholder="Zip Code" className="form_input" />
                    <label htmlFor="password"></label>
                    <input type="password" id="password" placeholder="Password" className="form_input" />
                    <label htmlFor="passwordConfirm"></label>
                    <input type="password" id="passwordConfirm" placeholder="Confirm Password" className="form_input" />
                    <input type="button" onClick={this.checkForm} id="submit" value="Register" className="btn"></input>
                    <div id="formErrors"></div>
                </form>
            </div>
        );
    }
}

export default RegisterForm;