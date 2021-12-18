const db = require("../db");

const customerSchema = new db.Schema({
    fullName: String,
    email:      String,
    passwordHash:   String,
    zipCode:    String,
    lastAccess:     { type: Date, default: Date.now },
 });


const Customer = db.model("Customer", customerSchema);

module.exports = Customer;