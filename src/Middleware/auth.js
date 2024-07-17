const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        req.user = decoded;
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).send('Access denied. User not found.');
        }
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = auth;
