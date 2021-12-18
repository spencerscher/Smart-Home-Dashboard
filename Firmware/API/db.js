// to use mongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ece413:ece413@cluster0.y8msi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology:true });


module.exports = mongoose;