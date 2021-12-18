var express = require('express');
var router = express.Router();
var fs = require('fs');
var Device = require("../models/device");
var Customer = require("../models/customer");
var jwt = require("jwt-simple");

router.post("/register", function (req, res) {
    Customer.findOne({ email: req.body.name }, function (err, device) {
        if (err) res.status(401).json({ success: false, err: err });
        else if (device) {
            res.status(401).json({ success: false, msg: "This device name already used" });
        }
        else {
            const newDevice = new Device({
                name: req.body.name,
                email: req.body.email,
                deviceId: req.body.ID,
                token: req.body.token
            });

            console.log(newDevice);
 
            newDevice.save(function (err, customer) {
                if (err) {
                    res.status(400).json({ success: false, err: err });
                }
                else {
                    let msgStr = `Device (${req.body.name}) has been created.`;
                    res.status(201).json({ success: true, message: msgStr });
                    console.log(msgStr);
                }
            });
        }
    });
 });

 router.post("/all", function (req, res) {
    console.log(req.body.email);
    Device.find({ email: req.body.email }, function (err, device) {
        console.log(device);
        if (err) res.status(401).json({ success: false, err: err });
        else {
            res.status(201).json({ success: true, device });
            
        }
    });
 });

 router.post("/remove", function (req,res){
    
  Device.deleteOne({ deviceId: req.body.id }, function(err,device){
      if (err) throw err;
      else{
          res.send(device);
      }
  })
});


module.exports = router;