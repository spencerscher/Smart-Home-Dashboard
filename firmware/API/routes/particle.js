// 1. create a router as a module
var fs = require('fs');
var express = require('express');
var router = express.Router();
var request = require('superagent');
const Device = require('../models/device');
const Temp = require('../models/temperature');
const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();
const jwt = require("jwt-simple");
const Customer = require('../models/customer');


/* Please use your device id and access token for your testing*/
/* For your project, device ID and token should be in your database*/
// var deviceInfo = {
//     id: '',
//     token: ''
// };


let getDeviceInfo = async (id) => {
    return Device.findOne({ deviceId: id })
}


// router.get('/devinfo', function(req, res){
//     console.log(deviceInfo);
//     res.send(deviceInfo);
// });

router.post("/all", function (req, res) {
    Device.find({ email: req.body.email }, function (err, device) {
        console.log(device);
        if (err) res.status(401).json({ success: false, err: err });
        else {
            res.status(201).json({ success: true, device });

        }
    });
});


var rxData = {};

// 2. defines some routes
router.post('/report', function (req, res) {
    rxData = JSON.parse(req.body.data);
    simulatedClock(rxData);
    console.log(rxData);
    res.status(201).json({ status: 'ok' });
});

router.get('/temperature', function (req, res) {
    Temp.find({}, function (err, result) {
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let hour = today.getHours();
        let min = today.getMinutes();
        let sec = today.getSeconds();

        var tempArray = [];

        for (let i = 0; i < result.length; i++) {
            let fullArray = result[i].referenceTime.split(" ");
            let timeArray = fullArray[4].split(":");

            if (fullArray[3] == year) {
                if (fullArray[1] == "Jan") {
                    var dataMonth = 1;
                } else if (fullArray[1] == "Feb") {
                    var dataMonth = 2;
                } else if (fullArray[1] == "Mar") {
                    var dataMonth = 3;
                } else if (fullArray[1] == "Apr") {
                    var dataMonth = 4;
                } else if (fullArray[1] == "May") {
                    var dataMonth = 5;
                } else if (fullArray[1] == "June") {
                    var dataMonth = 6;
                } else if (fullArray[1] == "July") {
                    var dataMonth = 7;
                } else if (fullArray[1] == "Aug") {
                    var dataMonth = 8;
                } else if (fullArray[1] == "Sept") {
                    var dataMonth = 9;
                } else if (fullArray[1] == "Oct") {
                    var dataMonth = 10;
                } else if (fullArray[1] == "Nov") {
                    var dataMonth = 11;
                } else {
                    var dataMonth = 12;
                }
                if (dataMonth == month) {
                    if (day - fullArray[2] == 1) {
                        if ((parseInt(timeArray[0] * 3600) + parseInt(timeArray[1] * 60) + parseInt(timeArray[2])) > (hour * 3600 + min * 60 + sec)) {
                            tempArray.push(result[i].temperature);
                        }
                    } else if (day - fullArray[2] == 0) {
                        if ((parseInt(timeArray[0] * 3600) + parseInt(timeArray[1] * 60) + parseInt(timeArray[2])) < (hour * 3600 + min * 60 + sec)) {
                            tempArray.push(result[i].temperature);
                        }
                    }
                }
            }
        }

        res.status(200).json(tempArray);
    });
});


router.post('/publish', function (req, res) {
    //console.log(req.body);
    getDeviceInfo(req.body.ID).then((d) => {
        console.log(d)
        request
            .post("https://api.particle.io/v1/devices/" + req.body.ID + "/cloudcmd")
            .set('Authorization', 'Bearer ' + d.token)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ args: JSON.stringify(req.body) })
            .then(response => {
                res.status(200).json({ cmd: '-', success: true });
            })
            .catch(err => {
                res.status(201).json({ cmd: '-', success: false });
            });
    })
});

router.post('/cloudpublish', function (req, res) {
    //console.log(req.body);
    getDeviceInfo(req.body.ID).then((d) => {
        console.log(d)
        request
            .post("https://api.particle.io/v1/devices/" + req.body.ID + "/cloudcmd")
            .set('Authorization', 'Bearer ' + d.token)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ args: JSON.stringify(req.body) })
            .then(response => {
                res.status(200).json({ cmd: 'publish', success: true });
            })
            .catch(err => {
                res.status(201).json({ cmd: 'publish', success: false });
            });
    })
});



router.get('/ping/:ID', function (req, res) {
    getDeviceInfo(req.params.ID).then((d) => {
        console.log(d)
        request
            .put("https://api.particle.io/v1/devices/" + req.params.ID + "/ping")
            .set('Authorization', 'Bearer ' + d.token)
            .set('Accept', 'application/json')
            .send()
            .then(response => {
                res.status(200).json({ cmd: 'ping', success: true, data: JSON.parse(response.text) });
            })
            .catch(err => {
                res.status(201).json({ cmd: 'ping', success: false, data: JSON.parse(err.response.text) });
            });
    })
});

router.get('/read', function (req, res) {
    let retData = rxData;
    const token = req.headers["x-auth"];
    const device = req.headers["device-id"];
    if (simulatedTime) retData["simclock"] = simulatedTime.toString();
    const decoded = jwt.decode(token, secret);

    Customer.findOne({ email: decoded.email }, function (err, customer) {
        //write retData to database
        if (err) res.status(401).json({ success: false, err: err });
        else {
            const temp = new Temp({
                referenceTime: retData["simclock"],
                temperature: retData["temp"],
                humidity: retData["hum"],
                deviceId: device,
                email: decoded.email
            });

            console.log(retData);

            temp.save(function (err, temperature) {
                if (err) {
                    res.status(400).json({ success: false, err: err });
                    console.log("Failed to save temperature to database.");
                }
                else {
                    let msgStr = `New temperature has been saved to db.`;
                    res.status(201).json({ cmd: 'read', data: retData });
                    console.log(msgStr);
                }
            });
        }
    });
});

router.post('/period', function(req, res) {
    const period = req.body.period;
    clockUnit = 60 * period;
    console.log(`Clock unit is ${clockUnit}`);
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Simulated clock
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var referenceTimeInSec = null;
var clockUnit = 600;     // 1 sec --> 10 minutes
let simulatedTime = null;
function simulatedClock(data) {
    let str = "";
    if ("t" in data) {
        if (referenceTimeInSec == null) {
            referenceTimeInSec = data.t;
        }
        let curTimeInSec = data.t;
        let simTimeInSec = referenceTimeInSec + (curTimeInSec - referenceTimeInSec) * clockUnit;
        let curTime = new Date(curTimeInSec * 1000);
        simulatedTime = new Date(simTimeInSec * 1000);
    }
}

function getTemperature(req, res) {
    Temp.find({}, function (err, result) {
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let hour = today.getHours();
        let min = today.getMinutes();
        let sec = today.getSeconds();

        var tempArray = [];

        for (let i = 0; i < result.length; i++) {
            let fullArray = result[i].referenceTime.split(" ");
            let timeArray = fullArray[4].split(":");

            if (fullArray[3] == year) {
                if (fullArray[1] == "Jan") {
                    var dataMonth = 1;
                } else if (fullArray[1] == "Feb") {
                    var dataMonth = 2;
                } else if (fullArray[1] == "Mar") {
                    var dataMonth = 3;
                } else if (fullArray[1] == "Apr") {
                    var dataMonth = 4;
                } else if (fullArray[1] == "May") {
                    var dataMonth = 5;
                } else if (fullArray[1] == "June") {
                    var dataMonth = 6;
                } else if (fullArray[1] == "July") {
                    var dataMonth = 7;
                } else if (fullArray[1] == "Aug") {
                    var dataMonth = 8;
                } else if (fullArray[1] == "Sept") {
                    var dataMonth = 9;
                } else if (fullArray[1] == "Oct") {
                    var dataMonth = 10;
                } else if (fullArray[1] == "Nov") {
                    var dataMonth = 11;
                } else {
                    var dataMonth = 12;
                }
                if (dataMonth == month) {
                    if (day - fullArray[2] == 1) {
                        if ((parseInt(timeArray[0] * 3600) + parseInt(timeArray[1] * 60) + parseInt(timeArray[2])) > (hour * 3600 + min * 60 + sec)) {
                            tempArray.push(result[i].temperature);
                        }
                    } else if (day - fullArray[2] == 0) {
                        if ((parseInt(timeArray[0] * 3600) + parseInt(timeArray[1] * 60) + parseInt(timeArray[2])) < (hour * 3600 + min * 60 + sec)) {
                            tempArray.push(result[i].temperature);
                        }
                    }
                }
            }
        }

        res.status(201).json(tempArray);
    });
}

// 3. mounts the router module on a path in the main app
module.exports = router;
