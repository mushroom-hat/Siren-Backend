const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateUsername, validatePassword } = require('../middleware/validateInput');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // validate input
    if (!validateUsername(username)) return res.status(400).json({ 'message': 'Incorrect username format.' });
    if (!validatePassword(password)) return res.status(400).json({ 'message': 'Incorrect password format.' });

    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.status(401).json({ 'message': 'Login failed.' });
    // if found user in users.json, compare password
    try {
        const match = await bcrypt.compare(password, foundUser.password);
        if (match) {
            // const roles = Object.values(foundUser.roles);
            const roles = Object.values(foundUser.roles).filter(Boolean);

            // Create JWT Token here
            const accessToken = jwt.sign(
                {  
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": roles
                    }
                }, 
                process.env.ACCESS_TOKEN_SECRET, 
                { expiresIn: '1d' }
            );
            
            // RefreshToken to verify that you can get a NEW access token
            const refreshToken = jwt.sign(
                { "username": foundUser.username, 
                "roles": roles }, 
                process.env.REFRESH_TOKEN_SECRET, 
                { expiresIn: '1d' } // rmb to change to 1h
            );

            // save refresh token of current user to db to enable logout
            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();

            // set cookie
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }); // max age 1 day. Also this cookie settings should be set the same in the logoutController
            res.status(200).json({accessToken})
        }
        else res.sendStatus(401);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleLogin }