import React, { Component, useState } from 'react';
import { Line } from 'react-chartjs-2';
import './CSS/Dashboard.css'
import $ from "jquery";
import { ReactComponent as Weather } from '../resources/weather.svg'
import { ReactComponent as Light } from '../resources/bulb.svg'
import { ReactComponent as Door } from '../resources/door.svg'
import { ReactComponent as Settings } from '../resources/settings.svg'
import { ReactComponent as Thermostat } from '../resources/thermostat.svg'
import { ReactComponent as Device } from '../resources/cable.svg'
import { Typography, Box, Grid, Button, Slider, Switch, FormGroup, FormControlLabel, TextField } from "@material-ui/core";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const twentyFour = {
    labels: ['4:00 AM',
        '8:00 AM',
        '12:00 PM',
        '4:00 PM',
        '8:00 PM',
        '12:00 AM'
    ],
    datasets: [
        {
            label: '24-Temp History  ',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [65, 59, 80, 81, 56]
        }
    ]
}

const sevenDay = {
    labels: ['4:00 AM',
        '8:00 AM',
        '12:00 PM',
        '4:00 PM',
        '8:00 PM',
        '12:00 AM'
    ],
    datasets: [
        {
            label: '24-Temp History  ',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [65, 59, 80, 81, 56]
        }
    ]
}



let name = null;
var myInterval = null;
class Dashboard extends Component {

    readData = () => {
        $.ajax({
            url: '/particle/read',
            method: 'GET',
            dataType: 'json',
            headers: { 'x-auth': window.localStorage.getItem("token"), 'device-id': $('#devicesList').val() },
        }).done(this.particleSuccess).fail(this.particleFailure);
    }

    enableDisablePublish = () => {
        let bPublish;
        if ($('#btnEnablePublish').html() == 'Enable publish') bPublish = true;
        else bPublish = false;
        let cmd = {
            ID: $('#devicesList').val(),
            publish: bPublish
        };
        console.log(JSON.stringify(cmd));
        $.ajax({
            url: '/particle/cloudpublish',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(cmd),
            dataType: 'json'
        }).done(this.particleSuccess).fail(this.particleFailure);
    }

    // acControl = () => {
    //     console.log('acControl');
    //     let bPublish;
    //     if ($('#btnEnablePublish').html() == 'Enable publish') bPublish = true;
    //     else bPublish = true;
    //     let cmd = {
    //         ID: $('#devicesList').val(),
    //         dht11: {}
    //     };

    //     if($("#autoOnOff").is(":checked")){
    //         console.log("AC ON");
    //         cmd.dht11["auto"] = $("#tempSlider").val();
    //     }
    //     else{
    //         console.log("AC OFF");
    //         cmd.dht11["off"] = $("#tempSlider").val();;
    //     }


    //     console.log(JSON.stringify(cmd));
    //     $.ajax({
    //         url: '/particle/publish',
    //         method: 'POST',
    //         contentType: 'application/json',
    //         data: JSON.stringify(cmd),
    //         dataType: 'json'
    //     }).done(this.particleSuccess).fail(this.particleFailure);
    // }

    acControl = (option, value) => {
        if (option == 'mode' && value == 1) {
            $("#tempSlider").attr("disabled", false);
        }
        else if (option == 'mode' && value == 0) {
            $("#acStatus").text("Off");
            $("#tempSlider").attr("disabled", true);
        }

        let num = $("#tempSlider").val();
        $("#tempNum").text(num + "°F");

        console.log(value);
        let bPublish;
        if ($('#btnEnablePublish').html() == 'Enable publish') bPublish = true;
        else bPublish = false;
        let cmd = {
            ID: $('#devicesList').val(),
            dht11: {}
        };
        cmd.dht11[option] = value;
        $.ajax({
            url: '/particle/publish',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(cmd),
            dataType: 'json'
        }).done(this.particleSuccess).fail(this.particleFailure);
    }

    smartlight = (option, value) => {
        if (option == 'auto' && value == 1) {
            $("#lightSlider").attr("disabled", true);
        }
        else if (option == 'auto' && value == 0) {
            $("#lightSlider").attr("disabled", false);
        }
        let num = $("#lightSlider").val();
        $("#lightNum").text(num + "%");
        let bPublish;
        if ($('#btnEnablePublish').html() == 'Enable publish') bPublish = true;
        else bPublish = false;
        let cmd = {
            ID: $('#devicesList').val(),
            smartlight: {}
        };
        cmd.smartlight[option] = value;

        //console.log(option + " " + value);
        console.log(cmd);

        //console.log(JSON.stringify(cmd));
        $.ajax({
            url: '/particle/publish',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(cmd),
            dataType: 'json'
        }).done(this.particleSuccess).fail(this.particleFailure);
    }

    //gets current weather data from openweathermap.org
    getWeatherData = () => {
        $.ajax({
            url: '/customers/status',
            method: 'GET',
            headers: { 'x-auth': window.localStorage.getItem("token") },
            dataType: 'json'
        })
            .done(function (data, textStatus, jqXHR) {
                $.ajax({
                    url: `http://api.openweathermap.org/data/2.5/weather?zip=${data[0].zipCode}&units=imperial&appid=542ffd081e67f4512b705f89d2a611b2`,
                    method: 'GET',
                    dataType: 'json'
                }).done((data) => {
                    //populate dashboard with the rest of the weather data here.
                    $('#weatherCity').text(data.name);
                    $('#weather').html(data.main.temp + '&deg;F');
                    $('#tempOutside').html(data.main.temp + '&deg;F');
                    $('#humidityOutside').html(data.main.humidity + '%');
                    $('#windSpeed').html(data.wind.speed + ' mph');
                    $('#forecast').html(data.weather[0].description);
                })
            });
    }

    // <div>
    // Temperature Outside: <span id="tempOutside"></span>
    // <br></br>
    // Humidity: <span id="humidityOutside"></span>
    // <br></br>
    // Forecast: <span id="forecast"></span>


    particleSuccess = (data, textStatus, jqXHR) => {
        $('#cmdStatusData').html(JSON.stringify(data, null, 2));
        if ("cmd" in data) {
            if (data.cmd === "ping") {
                if ("online" in data.data) {
                    if (data.data.online) {
                        $('#currDevice').text($('#devicesList').val() + " : Connected.");
                    }
                    else $('#currDevice').text('Device Offline: ' + $('#devicesList').val());
                }
            }
            else if (data.cmd === "read") {
                if ("simclock" in data.data) $('#curTime').html(data.data.simclock);
                let tempTime = data.data.simclock.split(' ');
                let parsedTime = tempTime[4].split(':');
                let checkTime = '' + parseInt(parsedTime[0],10) + ':' + parseInt(parsedTime[1].split('')[0],10);
                console.log(checkTime);
                console.log($('#bedtime').val());
                let time2 = $('#bedtime').val();
                if(time2 != ""){
                    let parsedTime2 = time2.split(':');
                    let checkTime2 = '' + parseInt(parsedTime2[0],10) + ':' + parseInt(parsedTime2[1].split('')[0],10);
                    if(checkTime == checkTime2){
                        this.smartlight('on', 0);
                        console.log("It's time for bed!");
                    }
                }
                if ("light" in data.data) {
                    if (data.data.light < 700) {
                        $('body').css('background-color', 'rgba(19, 47, 54, 0.59)');
                        $('#lightType').text('Low Light');
                        $('#lightMode').text(data.data.light);
                    }
                    else {
                        $('body').css('background-color', 'rgba(78, 202, 233, 0.514)');
                        $('#lightType').text('Bright');
                        $('#lightMode').text(data.data.light);
                    }
                }
                if ("door" in data.data) {
                    if (data.data.door < 700) {
                        $('#doorStatus').text('Closed - ' + data.data.door);
                    } else {
                        $('#doorStatus').text('Opened - ' + data.data.door);
                    }

                }
                if ("hum" in data.data.dht11) {
                    $('#hum').text(data.data.dht11.hum);
                }
                if ("temp" in data.data.dht11) {
                    $('#temp').text(data.data.dht11.temp);
                }
                if ("s" in data.data.dht11) {
                    if (data.data.dht11.s == "0") {
                        $('#acStatus').text("Off");
                    }
                    else if (data.data.dht11.s == "1") {
                        $('#acStatus').text("On");
                    }
                    else if (data.data.dht11.s == "2") {
                        $('#acStatus').text("On");
                    }
                }

            }
            else if ((data.cmd === "publish") && (data.success)) {
                if ($('#btnEnablePublish').html() == 'Enable publish') {
                    $('#btnEnablePublish').html('Disable publish');
                    myInterval = setInterval(this.readData, 1000);
                }
                else {
                    $('#btnEnablePublish').html('Enable publish');
                    if (myInterval != null) {
                        clearInterval(myInterval);
                        myInterval = null;
                    }
                }
            }
        }
    }


    particleFailure = (jqXHR, textStatus, errorThrown) => {
        $('#cmdStatusData').html(JSON.stringify(jqXHR, null, 2));
    }


    ping = () => {
        let device = $('#devicesList').val();
        $.ajax({
            url: '/particle/ping/' + device,
            method: 'GET',
            dataType: 'json'
        }).done(this.particleSuccess).fail(this.particleFailure);
    }

    // ping2 = () => {
    //     console.log('ping2');
    //     let device = $('#devicesList').val();
    //     $.ajax({
    //         url: '/particle/ping/' + device,
    //         method: 'GET',
    //         dataType: 'json'
    // }).done(console.log("Hello"), $('#currDevice').html($('#devicesList').val() + " : Connected."), $('#ping').html("Ping Successful"), $('#doorStatus').html(this.getrandomdoor()), $('#temp').html(this.getrandomtemp())).fail(console.log("Hi"), $('#currDevice').html($('#devicesList').val() + " : Connected."));
    // }

    deviceStatus = () => {
        $.ajax({
            url: '/particle/devinfo',
            method: 'GET',
            contentType: 'application/json',
            dataType: 'json'
        })
            .done(function (data, textStatus, jqXHR) {
                console.log(data);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            });
    }

    removeDevice = () => {
        let txdata = {
            id: $("#devicesList").val()
        }
        let id = $("#devicesList").val();
        console.log(txdata);
        $.ajax({
            url: '/device/remove',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
            .done(function (data, textStatus, jqXHR) {
                $(`#devicesList option[value=${id}]`).remove();
            });
    }


    run2RegisterDevice = () => {
        window.location.replace("deviceRegister");
    }

    getUserData = () => {
        $.ajax({
            url: '/customers/status',
            method: 'GET',
            headers: { 'x-auth': window.localStorage.getItem("token") },
            dataType: 'json'
        })
            .done(function (data, textStatus, jqXHR) {
                $('#name').html(data[0].fullName);
            });
    }

    getDeviceName = () => {
        $("#devicesList").remove();
        $.ajax({
            url: '/customers/status',
            method: 'GET',
            headers: { 'x-auth': window.localStorage.getItem("token") },
            dataType: 'json'
        })
            .done(function (data, textStatus, jqXHR) {
                let txdata = {
                    email: data[0].email
                };


                $.ajax({
                    url: '/device/all',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(txdata),
                    dataType: 'json'
                })
                    .done(function (data, textStatus, jqXHR) {
                        for (let i = 0; i < data.device.length; i++) {
                            let newElement = $("<option></option>").text(data.device[i].name);
                            newElement.val(data.device[i].deviceId);
                            $("#devicesList").append(newElement);
                        }
                    });
            });

    }

    handleChange1 = (event) => {
        var tempSlider = $("#tempSlider").val();
        $("#tempValue").html(tempSlider + '&deg;F');

        //set status based on received JSON response from device
        if (tempSlider > 70) {
            $("#acStatus").html("Cooling");
        }
        else {
            $("#acStatus").html("Off");
        }
        console.log("Temperature: " + tempSlider);
    }

    handleChange2 = (event) => {
        var lightSlider = $("#lightSlider").val();
        $("#lightValue").html(lightSlider + '%');
        console.log("Brightness: " + lightSlider);
    }

    handleChange3 = (event) => {
        var weatherSlider = $("#weatherSlider").val();
        console.log("Weather: " + weatherSlider);
    }

    updateSample = () => {
        let txdata = {
            period: $("#samplePeriod").val(),
        }
        console.log(txdata);
        $.ajax({
            url: '/particle/period',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
            .done(function (data, textStatus, jqXHR) {
                console.log(data);
            });
    }




    render() {
        this.getUserData();
        this.getDeviceName();
        this.getWeatherData();

        // $.ajax({
        //     url: '/particle/temperature',
        //     method: 'GET',
        //     dataType: 'json'
        // })
        //     .done(function (data, textStatus, jqXHR) {
        //         console.log(data);
        //     });

        return (
            <div className="wrapper">
                <div className="data">
                    {/* <div className="welcome">
                        Welcome to Smart Hub
                    </div> */}
                    <div className="welcome">
                        Welcome to Smart Home Hub, <span id="name"></span>
                    </div>
                    <div className="info">
                        Weather: <span id="weather"></span>
                    </div>
                    <div className="info">
                        <span id="currDevice"></span>
                    </div>
                    <div className="info">
                        <span id="ping"></span>
                    </div>
                </div>
                <div id="Temp24" className="panelType">
                    {/* Thermostat */}
                    {/* <Weather className="icon" /> */}
                    {/* If there is no data, display "No weather data" */}
                    <center>
                        {/* <Line className="one"

                            data={twentyFour}
                            options={{
                                title: {
                                    display: true,
                                    text: 'Average Rainfall per month',
                                    fontSize: 20,
                                    responsive: true,
                                    maintainAspectRatio: false
                                },
                                legend: {
                                    display: true,
                                    position: 'right'
                                }
                            }}
                        /> */}
                        {/* 24-hour weather data unavailable. */}
                    </center>
                </div>
                <div id="Humid24" className="panelType">
                    {/* Thermostat */}
                    <center>
                        {/* <Line

                            data={sevenDay}
                            options={{
                                title: {
                                    display: true,
                                    text: 'Average Rainfall per month',
                                    fontSize: 20,
                                    responsive: true,
                                    maintainAspectRatio: false
                                },
                                legend: {
                                    display: true,
                                    position: 'right'
                                }
                            }}
                        /> */}
                    </center>
                </div>
                <div id="sevenDay" className="panelType">
                    {/* Thermostat */}
                    <center>
                        {/* <Line

                            data={sevenDay}
                            options={{
                                title: {
                                    display: true,
                                    text: 'Average Rainfall per month',
                                    fontSize: 20,
                                    responsive: true,
                                    maintainAspectRatio: false
                                },
                                legend: {
                                    display: true,
                                    position: 'right'
                                }
                            }}
                        /> */}
                    </center>
                </div>
                <div id="Weather" className="panelType">
                    {/* Thermostat */}
                    <Weather className="icon" />

                    <div>
                        <center>
                            <div>
                                <h2>Weather: <span id="weatherCity"></span></h2>
                                <br></br>
                                <br></br>
                                Temperature: <span id="tempOutside"></span>
                                <br></br>
                                <br></br>
                                Humidity: <span id="humidityOutside"></span>
                                <br></br>
                                <br></br>
                                Wind Speed: <span id="windSpeed"></span>
                                <br></br>
                                <br></br>
                                Forecast: <span id="forecast"></span>
                                <br></br>
                            </div>
                        </center>
                    </div>
                </div>
                <div id="Temperature" className="panelType">
                    {/* Temperature/Humidity */}
                    <Thermostat className="icon" />
                    <center>
                        <label for="tempMode">Mode</label>
                        <br></br>
                        <input type="range" id="tempMode" name="mode" min="0" max="1" onChange={(e) => this.acControl("mode", e.target.value)} />

                        {/* <label class="switch">
                            <input type="checkbox" id="autoOnOff" onClick={(e) => this.acControl("mode", this)}/>
                            <label for="autoOnOff"> Auto</label>
                            <span class ="slider round"></span>
                        </label> */}
                    </center>
                    {/* <Slider
                        size="small"
                        defaultValue={70}
                        aria-label="Small"
                        valueLabelDisplay="auto"
                    /> */}
                    <div>
                        <label for="tempSlider" id="tempValue">Set Temp: <span id="tempNum"></span></label>
                        <br></br>
                        <input type="range" id="tempSlider" name="volume" min="0" max="100" onChange={(e) => this.acControl("dTemp", e.target.value)} />
                    </div>
                    <div>
                        Current Temp: <span id="temp"></span> &deg;F
                    </div>
                    <br></br>
                    <div>
                        Current Humidity: <span id="hum"></span> %
                    </div>
                    <br></br>
                    <div>
                        AC Status: <span id="acStatus"></span>
                    </div>
                </div>
                <div id="Door" className="panelType">
                    {/* Door Status */}
                    <Door className="icon" />
                    <div>
                        Door Status: <span id="doorStatus">Closed</span>
                    </div>
                </div>
                <div id="Light" className="panelType">
                    {/* Smart Light */}
                    <center>
                        <Light className="icon" />
                        <br></br>
                        <label for="tempOnOff">On</label>
                        <br></br>
                        <input type="range" id="tempOnOff" name="mode" min="0" max="1" onChange={(e) => this.smartlight("on", e.target.value)} />
                        <br></br>
                        <label for="tempMode">Auto</label>
                        <br></br>
                        <input type="range" id="tempMode" name="mode" min="0" max="1" onChange={(e) => this.smartlight("auto", e.target.value)} />
                        {/* <Slider
                            size="small"
                            defaultValue={70}
                            aria-label="Small"
                            valueLabelDisplay="auto"
                        /> */}
                        <div>
                            <br></br>
                            <label for="lightSlider" id="lightValue">Brightness: <span id="lightNum"></span></label>
                            <br></br>
                            <input type="range" id="lightSlider" name="volume" min="0" max="100" onChange={(e) => this.smartlight("brightness", e.target.value)} />

                        </div>
                        {/* <div id="lightInfo">
                            <span id="lightType">Brightness:</span> <span id="lightValue">0%</span>
                        </div> */}
                        <div class="md-form">
                            <small>Bedtime</small>
                            <input type="time" id="bedtime" name="appt" min="09:00" max="18:00" required />
                        </div>
                    </center>
                </div>
                <div id="Devices" className="panelType">
                    {/* Add Device */}
                    <Device className="icon" />
                    <center>
                        <br></br>
                        <input type="text" id="samplePeriod" placeholder="1 minute" />
                        {/* <TextField className="button" id="filled-basic" label="Sampling Period" variant="filled" /> */}
                        <Button className="button" variant="contained" color="primary" href="#contained-buttons" onClick={this.updateSample}>
                            Update Period
                        </Button>
                        <Button className="button" variant="contained" color="primary" href="#contained-buttons" onClick={this.ping}>
                            Ping
                        </Button>
                        <Button id="btnEnablePublish" className="button" variant="contained" color="primary" href="#contained-buttons" onClick={this.enableDisablePublish}>
                            Enable Publish
                        </Button>
                    </center>
                </div>
                <div id="Settings" className="panelType">
                    {/* Settings */}
                    <Settings className="icon" />
                    <br></br>
                    <label for="Devices">Devices: </label>
                    <select name="Devices" id="devicesList">
                    </select>
                    <Button onClick={this.run2RegisterDevice} className="button" variant="contained" color="primary" href="#contained-buttons">
                        Register
                    </Button>
                    <Button onClick={this.removeDevice} className="button" variant="contained" color="primary" href="#contained-buttons">
                        Remove
                    </Button>
                    <Button id="connect" className="button" variant="contained" color="primary" href="#contained-buttons" onClick={this.enableDisablePublish}>
                        Connect
                    </Button>
                    <Button id="disconnect" className="button" variant="contained" color="primary" href="#contained-buttons">
                        Disconnect
                    </Button>
                </div>

            </div>
        );
    }
}

export default Dashboard;