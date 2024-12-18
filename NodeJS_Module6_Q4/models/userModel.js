const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tokens: [String], 
});

module.exports = mongoose.model("Usernew", userSchema);
