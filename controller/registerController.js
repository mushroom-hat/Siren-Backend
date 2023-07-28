const User = require('../model/User');
const bcrypt = require('bcrypt');
const authController = require('./authController');
const otpController = require('./otpController_old');
const { validateUsername, validatePassword, validateEmail } = require('../middleware/validateInput');

const handleNewUser = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) return res.status(400).json({ 'message': 'Username, password and email are required.' });

    // validate inputs
    if (!validateUsername(username)) return res.status(400).json({ 'message': 'Username must be between 3 to 20 characters, including letters (both uppercase and lowercase), numbers, and underscores.' });
    if (!validatePassword(password)) return res.status(400).json({ 'message': 'Password must be at least 8 characters, including at least one symbol, one uppercase and lowercase letter and one number (@$!%*?&).' });
    if (!validateEmail(email)) return res.status(400).json({ 'message': 'Email must be in valid email format.' });

    const duplicate_users = await User.findOne({ username: username }).exec();
    if (duplicate_users) return res.status(409).json({ 'message': 'Username already exists.' });

    const duplicate_email = await User.findOne({ email_address: email }).exec();
    if (duplicate_users) return res.status(409).json({ 'message': 'Email Address already exists.' });

    // // verify email (sendOTP handled front-end)
    // otpController.verifyOTP(req, res);

    try {
        // encrypt the registered password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { 
            "username": username, 
            "password": hashedPassword,
            "email": email,
            "roles": {"User": req.body?.roles || 3} // role defaulted to User:3
         };
        
        // create and store new user
        const result = await User.create({
            username: newUser.username,
            password: newUser.password,
            email_address: newUser.email,
            roles: newUser.roles
        });
        return authController.handleLogin(req, res);
    }
    catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = {handleNewUser}