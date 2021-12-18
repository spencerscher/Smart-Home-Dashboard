var express = require('express');
var router = express.Router();
var Customer = require("../models/customer");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');

// On AWS ec2, you can use to store the secret in a separate file. 
// The file should be stored outside of your code directory. 
// For encoding/decoding JWT
const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();

// example of authentication
// register a new customer

// please fiil in the blanks
// see javascript/signup.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs
// in https://learn.zybooks.com/zybook/ARIZONAECE413513HongFall2021/chapter/9/section/3
router.post("/signUp", function (req, res) {
   Customer.findOne({ email: req.body.email }, function (err, customer) {
       if (err) res.status(401).json({ success: false, err: err });
       else if (customer) {
           res.status(401).json({ success: false, msg: "This email already used" });
       }
       else {
           const passwordHash = bcrypt.hashSync(req.body.password, 10);
           const newCustomer = new Customer({
               fullName: req.body.fullName,
               email: req.body.email,
               zipCode: req.body.zipCode,
               passwordHash: passwordHash
           });

           newCustomer.save(function (err, customer) {
               if (err) {
                   res.status(400).json({ success: false, err: err });
               }
               else {
                   let msgStr = `Customer (${req.body.email}) account has been created.`;
                   res.status(201).json({ success: true, message: msgStr });
                   console.log(msgStr);
               }
           });
       }
   });
});



// please fiil in the blanks
// see javascript/login.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs
// in https://learn.zybooks.com/zybook/ARIZONAECE413513HongFall2021/chapter/9/section/3
router.post("/logIn", function (req, res) {
   if (!req.body.email || !req.body.password) {
       res.status(401).json({ error: "Missing email and/or password" });
       return;
   }
   // Get user from the database
   Customer.findOne({ email: req.body.email }, function (err, customer) {
       if (err) {
           res.status(400).send(err);
       }
       else if (!customer) {
           // Username not in the database
           res.status(401).json({ error: "Login failure!!" });
       }
       else {
           if (bcrypt.compareSync(req.body.password, customer.passwordHash)) {
               const token = jwt.encode({ email: customer.email}, secret);
               //update user's last access time
               customer.lastAccess = new Date();
               customer.save((err, customer) => {
                   console.log("User's LastAccess has been update.");
               });
               // Send back a token that contains the user's username
               res.status(201).json({ success: true, token: token, msg: "Login success" });
           }
           else {
               res.status(401).json({ success: false, msg: "Email or password invalid." });
           }
       }
   });
});


router.get("/status", function (req, res) {
    // See if the X-Auth header is set
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
    }
 
    // X-Auth should contain the token 
    const token = req.headers["x-auth"];
    try {
        const decoded = jwt.decode(token, secret);
        // Send back email and last access
        Customer.find({ email: decoded.email }, "email lastAccess fullName zipCode", function (err, users) {
            if (err) {
                res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
            }
            else {
                res.status(200).json(users);
                // console.log(users);
            }
        });
    }
    catch (ex) {
        res.status(401).json({ success: false, message: "Invalid JWT" });
    }
 });

 router.post("/update", function (req, res) {
    if (!req.body.email || !req.body.password || !req.body.fullName) {
        res.status(401).json({ error: "Missing email and/or password and/or name" });
        return;
    }
    // Update user from the database
    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    Customer.updateOne({ email: req.body.email } , {$set: { fullName: req.body.fullName , passwordHash: passwordHash}} , function(err, customer){
        if (err) {
            res.status(400).send(err);
        }
        else{
            let msgStr = `Customer (${req.body.email}) account has been updated.`;
            res.status(201).json({ success: true, message: msgStr });
            console.log(msgStr);
        }
    });
    
 });





module.exports = router;