const axios = require('axios');
const jwt = require('jsonwebtoken');
const { oauth2Client } = require('../utils/googleClient');
const User = require('../models/user');

/* GET Google Authentication API. */
exports.googleAuth = async (req, res, next) => {
    const code = req.query.code;
    try {
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email, given_name, family_name, picture } = userRes.data;
        console.log(userRes);
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                firstName: given_name,
                lastName: family_name,
                email,
                avatar: picture,
            });
        }
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        res.status(200).json({
            message: 'success',
            token,
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};