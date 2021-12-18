import React, { Component } from 'react';
import './CSS/Register.css'
import $ from "jquery";


class LoginForm extends Component {


    register = () => {
        $.ajax({
            url: '/customers/status',
            method: 'GET',
            headers: { 'x-auth': window.localStorage.getItem("token") },
            dataType: 'json'
        })
            .done(function (data, textStatus, jqXHR) {
                const email = data[0].email;
                $("p").remove();

                const name = $('#name');
                const ID = $('#deviceID');
                const token = $('#accessToken');
                let noErrors = false;



                if (!name.val()) {
                    noErrors = true;
                    let nameErr = $("<p></p>").text("Please enter device's name.");
                    $("#msg").append(nameErr);
                }
                if (!ID.val()) {
                    noErrors = true;
                    let idErr = $("<p></p>").text("Please enter device's ID.");
                    $("#msg").append(idErr);
                }
                if (!token.val()) {
                    noErrors = true;
                    let tokenErr = $("<p></p>").text("Please enter access-token.");
                    $("#msg").append(tokenErr);
                }
                if (noErrors === false) {
                    let txdata = {
                        name: $('#name').val(),
                        email: email,
                        ID: $('#deviceID').val(),
                        token: $('#accessToken').val()
                    };

                    $.ajax({
                        url: '/device/register',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(txdata),
                        dataType: 'json'
                    })
                        .done(function (data, textStatus, jqXHR) {
                            let successErr = $("<p></p>").text("Successfully registered");
                            $("#msg").append(successErr);
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            $('#msg').html(JSON.stringify(jqXHR.responseJSON.msg, null, 2));
                        });
                }
            });



    }

    render() {
        return (
            <div className="user">
                <header className="user__header">
                </header>
                <form className="form">
                    <label htmlFor="name"></label>
                    <input type="text" id="name" placeholder="Device Name" className="form_input" />
                    <label htmlFor="deviceID"></label>
                    <input type="text" id="deviceID" placeholder="Device ID" className="form_input" />
                    <label htmlFor="accessToken"></label>
                    <input type="text" id="accessToken" placeholder="Access-Token" className="form_input" />
                    <input type="button" onClick={this.register} id="submit" value="Register" className="btn"></input>
                    <div id="msg"></div>
                </form>
                <br></br>
                <br></br>
                <div className="webhookInfo">
                        <p id="title">Webhook Information</p>
                        <p>Event Name: ece413</p>
                        <p>Webhook URL: http://ec2-3-15-155-66.us-east-2.compute.amazonaws.com:3000/particle/report</p>
                        <p>Request Type: POST</p>
                        <p>Request Format: JSON</p>
                        <p>Device: ANY</p>
                        <p>Status: Enabled</p>
                    </div>
            </div>
        );
    }
}

export default LoginForm;