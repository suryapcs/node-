const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/signup");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactnumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, 'your_jwt_secret_key', { expiresIn: '1h' });
    return token;
};

const User = mongoose.modelNames().includes('Users')
    ? mongoose.model('Users')
    : mongoose.model('Users', userSchema);

module.exports = User;
