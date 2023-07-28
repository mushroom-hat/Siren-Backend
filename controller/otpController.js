const {redisClient} = require('../config/redisConn');
const {generateOTP, sendEmail} = require('../helper/OTP');

const sendOTP = async (req, res) => {
    const email = req.body.email;
    const message = "Hi there! Before you proceed, please verify your email with the code below"
    const subject = "Email Verification"
    const duration = 60;
    if (!(email && subject && message)) return res.status(400).json({ 'message': 'Email is required.' });

    try {
        // generate pin
        const generatedOTP = await generateOTP();
        
        // save pin to redis
        await redisClient.setEx(email, duration, generatedOTP);
        
        // send email
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: subject + " from " +  process.env.APPNAME,
            html: `<p>${message}</p><p style="color:red;font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p><p>This OTP will expire in ${duration} seconds.</p>`
        };
        await sendEmail(mailOptions);
        res.status(200).json({ 'message': 'OTP sent successfully.' });
    }
    catch (error){
       res.status(400).json(error.message);
    }
}

const verifyOTP = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    if (!(email && otp)) return res.status(400).json({ 'message': 'Email and OTP are required.' });

    // search redis for OTP based on email
    const curr_otp = await redisClient.get(email);
    if (!curr_otp) return res.status(400).json({ 'message': 'OTP not found or expired.' });

    // if not expired yet, verify OTP
    if (curr_otp !== otp) return res.status(401).json({ 'message': 'OTP is invalid.' });
    return res.status(200).json({ 'message': 'OTP verification success.' });
}


module.exports = {
    sendOTP,
    verifyOTP,
}