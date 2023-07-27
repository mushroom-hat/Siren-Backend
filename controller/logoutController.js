const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken in memory (browser)
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken}).exec();
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(403);
    }
    
    // delete refreshToken in DB. Set it to empty and save it to DB
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result)

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true}); // add secure:true -in production, only serves on https
    res.status(200).json({ 'message': 'Sucessfully logged out' }); // no content
}

module.exports = { handleLogout }