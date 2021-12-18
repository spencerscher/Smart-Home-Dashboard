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

let name = null;
var myInterval = null;
var guiUpdated = false;
class DashboardSerial extends Component {


    updateGUI = (data) =>{
        // if (!guiUpdated) {
        //     if ("light" in data) {
        //         if ("L0" in data.light) $('#smartlightonoff').prop("checked", data.light.L0).change();
        //         if ("L1" in data.light) $('#smartlightMode').prop("checked", data.light.L1).change();
        //         if ("b" in data.light) $('#birghtnessSlider').val(data.light.b).change();
        //         if ("m" in data.light) $('#sensorMinSlider').val(data.light.m).change();
        //         if ("M" in data.light) $('#sensorMaxSlider').val(data.light.M).change();
        //     }
        //     if ("led" in data) {
        //         if ("h" in data.led) $('#ledHzSlider').val(data.led.h).change();
        //     }
        //     guiUpdated = true;
        // }
        if ("light" in data) {
            if ("s" in data.dht11) {
                if (data.dht11.s == "0") {
                    $('#acStatus').text("Off");
                }
                else if (data.dht11.s == "1") {
                    $('#acStatus').text("On");
                }
                else if (data.dht11.s == "2") {
                    $('#acStatus').text("On");
                }
            }
            if ("b" in data.light) {
                $('#curBrightness').css("background-color", `hsl(61, ${data.light.b}%, 50%)`);
                $('#curBrightness').html(data.light.b);
            }
        }
        if ("door" in data) {
            if (data.door < 700) {
                $('#doorStatus').text('Closed - ' + data.door);
            } else {
                $('#doorStatus').text('Opened - ' + data.door);
            }
        }
        if ("hum" in data.dht11) {
            $('#hum').text(data.dht11.hum);
        }
        if ("temp" in data.dht11) {
            $('#temp').text(data.dht11.temp);
        }

        if ("simclock" in data) $('#curTime').html(data.simclock);
        let tempTime = data.simclock.split(' ');
        let parsedTime = tempTime[4].split(':');
        let checkTime = '' + parseInt(parsedTime[0], 10) + ':' + parseInt(parsedTime[1].split('')[0], 10);
        console.log(checkTime);
        console.log($('#bedtime').val());
        let time2 = $('#bedtime').val();
        if (time2 != "") {
            let parsedTime2 = time2.split(':');
            let checkTime2 = '' + parseInt(parsedTime2[0], 10) + ':' + parseInt(parsedTime2[1].split('')[0], 10);
            if (checkTime == checkTime2) {
                this.smartlight('on', 0);
                console.log("It's time for bed!");
            }
        }
    }

    serailCmd = (data) => {
        $.ajax({
            url: '/serial/' + data.cmd,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json'
        }).done(this.serailSuccess).fail(this.serialFailure);
    }

    serailSuccess = (data, textStatus, jqXHR) => {
        if ("cmd" in data) {
            if (data.cmd === "scan") this.updateAvailableSerialList(data);
            else if (data.cmd === "open") this.finishOpenClose(data);
            else if (data.cmd === "close") this.finishOpenClose(data);

            if (data.cmd === "read") {
                let curStr = $('#rdData').html();
                curStr += JSON.stringify(data.data);
                $('#rdData').html(curStr);
               // document.getElementById("rdData").scrollTop = document.getElementById("rdData").scrollHeight;
                // update GUI
                this.updateGUI(data.data);
            }
            else {
                $('#cmdStatusData').html(JSON.stringify(data, null, 2));
            }
        }
    }

    serialFailure = (jqXHR, textStatus, errorThrown) =>{
        $('#cmdStatusData').html(JSON.stringify(jqXHR, null, 2));
    }

    updateAvailableSerialList = (data) => {
        if ("list" in data) {
            let curList = data.list;
            for (let newPort of curList) {
                $('#com_ports_list').append(`<option value="${newPort}">${newPort}</option>`);
            }
            if (curList.length == 1) {
                $("#com_ports_list option:eq(1)").prop("selected", true);
                this.connectDisconnect();
            }
        }
    }

    connectDisconnect = () => {
        console.log("Button registered.");
        if ($("#btnConnect").text() == "Connect") {
            let selectedPort = $("#com_ports_list").val();
            if (selectedPort === "null") {
                window.alert("Please select your COM port");
                return;
            }
            this.serailCmd({ cmd: "open", path: selectedPort });
        }
        else {
            this.serailCmd({ cmd: "close" });
        }
    }

    finishOpenClose = (data) => {
        if ($("#btnConnect").text() == "Connect") {
            $("#btnConnect").text("Disconnect");
            $("#com_status").text(data.msg);
            myInterval = setInterval( () => { this.serailCmd({ cmd: "read" }); }, 1000);
        }
        else {
            $("#btnConnect").text("Connect");
            $("#com_status").text(data.msg);
            if (myInterval != null) {
                clearInterval(myInterval);
                myInterval = null;
            }
        }
    }

    smartLightControl = (option, value) => {
        if (option == 'auto' && value == 1) {
            $("#lightSlider").attr("disabled", true);
        }
        else if (option == 'auto' && value == 0) {
            $("#lightSlider").attr("disabled", false);
        }
        let num = $("#lightSlider").val();
        $("#lightNum").text(num + "%");
        let txcmd = {
            cmd: "write",
            data: {
                smartlight: {}
            }
        };
        txcmd.data.smartlight[option] = value;

        console.log(JSON.stringify(txcmd));
        this.serailCmd(txcmd);
    }

    acControlSerial = (option, value) =>{
        if (option == 'mode' && value == 1) {
            $("#tempSlider").attr("disabled", false);
        }
        else if (option == 'mode' && value == 0) {
            $("#acStatus").text("Off");
            $("#tempSlider").attr("disabled", true);
        }

        let num = $("#tempSlider").val();
        $("#tempNum").text(num + "°F");
        let txcmd = {
            cmd: "write",
            data: {
                dht11: {}
            }
        };
        txcmd.data.dht11[option] = value;

        console.log(JSON.stringify(txcmd));
        this.serailCmd(txcmd);
    }

    toggleLedControl = (value) => {
        let txcmd = {
            cmd: "write",
            data: {
                led: { frequency: value }
            }
        };
        console.log(JSON.stringify(txcmd));
        this.serailCmd(txcmd);
    }

    updateSampleSerial = () => {
        let txdata = {
            period: $("#samplePeriod").val(),
        }
        console.log(txdata);
        $.ajax({
            url: '/serial/period',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(txdata),
            dataType: 'json'
        })
            .done(function (data, textStatus, jqXHR) {
                console.log(data);
            });
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






    render() {
        this.getUserData();
        this.getWeatherData();
        this.serailCmd({ cmd: "scan" });

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
                        <input type="range" id="tempMode" name="mode" min="0" max="1" onChange={(e) => this.acControlSerial("mode", e.target.value)} />

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
                        <input type="range" id="tempSlider" name="volume" min="0" max="100" onChange={(e) => this.acControlSerial("dTemp", e.target.value)} />
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
                        <input type="range" id="tempOnOff" name="mode" min="0" max="1" onChange={(e) => this.smartLightControl("on", e.target.value)} />
                        <br></br>
                        <label for="tempMode">Auto</label>
                        <br></br>
                        <input type="range" id="tempMode" name="mode" min="0" max="1" onChange={(e) => this.smartLightControl("auto", e.target.value)} />
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
                            <input type="range" id="lightSlider" name="volume" min="0" max="100" onChange={(e) => this.smartLightControl("brightness", e.target.value)} />

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
                        <Button className="button" variant="contained" color="primary" href="#contained-buttons" onClick={this.updateSampleSerial}>
                            Update Period
                        </Button>
                    </center>
                </div>
                <div id="Settings" className="panelType">
                    {/* Settings */}
                    <Settings className="icon" />
                    <br></br>
                    <label for="Devices">Select Port: </label>
                    <select id="com_ports_list">
                        <option selected value="null">Please select your port</option>
                    </select>
                    <Button id="btnConnect" className="button" variant="contained" color="primary" href="#contained-buttons" onClick={this.connectDisconnect}>
                        Connect
                    </Button>
                    <div>COM Status:<br></br><span id="com_status"></span></div>
                </div>

            </div>
        );
    }
}

export default DashboardSerial;