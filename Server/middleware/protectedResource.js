const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');

module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    // bearer space Random token
    if (!authorization) {
        return res.status(401).json({error: "User not Logged in!"})
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err){
            return res.status(401).json({error: "User not Logged in!"})
        }
        const {_id} = payload;
        UserModel.findById(_id)
        .then((dbuser) => {
            req.user = dbuser;
            next(); // goes to next middleware or goes to restAPI
        })
    })
}