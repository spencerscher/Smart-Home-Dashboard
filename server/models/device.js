var db = require("../db");

var deviceSchema = new db.Schema({
    deviceId:     String,
    email:      String,
    name:    String,
    token: String
});

var Device = db.model("Device", deviceSchema);

module.exports = Device;