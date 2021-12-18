var db = require("../db");

var temperatureSchema = new db.Schema({
    referenceTime:     String,
    temperature:      String,
    humidity:    String,
    deviceId: String,
    email: String
    
});

var Temperature = db.model("Temperature", temperatureSchema);

module.exports = Temperature;