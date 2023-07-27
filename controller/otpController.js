const OTP = require('../model/OTP');
const {generateOTP, sendEmail} = require('../helper/OTP');

const sendOTP = async (req, res) => {

    const email = req.body.email;
    const message = "Hi there! Before you proceed, please verify your email with the code below"
    const subject = "Email Verification"
    const duration = 60;
    if (!(email && subject && message)) return res.status(400).json({ 'message': 'Email is required.' });

    try {

         // clear any old record
        await OTP.deleteOne({ email_address: email }).exec();

        // generate pin
        const generatedOTP = await generateOTP();
        console.log(generatedOTP);
        // send email
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: subject + " from " +  process.env.APPNAME,
            html: `<p>${message}</p><p style="color:red;font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p><p>This OTP will expire in ${duration} seconds.</p>`
        };
        await sendEmail(mailOptions);

        // create new OTP record that expires in 60 seconds
        const newOTP = await new OTP({
            email_address: email,
            otp: generatedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + duration * 1000
        });


        // save OTP to db
        const createdOTPRecord = await newOTP.save();
        res.status(200).json(createdOTPRecord);

    }   
    catch (error){
       res.status(400).json(error.message);
    }

}  

const verifyOTP = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    if (!(email && otp)) return res.status(400).json({ 'message': 'Email and OTP are required.' });

    // find existing OTP based on email
    const matchedOTPRecord = await OTP.findOne({email_address: email}).exec();

    if (!matchedOTPRecord) return res.status(401).json({ 'message': 'No OTP Records found.' });

    const {expiresAt} = matchedOTPRecord;
    // check for expired code
    if (expiresAt < Date.now()){
        await OTP.deleteOne({email_address: email}).exec();
        return res.status(401).json({ 'message': 'OTP has expired.' });
    }

    // if not expired yet, verify OTP
    if (matchedOTPRecord.otp !== otp) return res.status(401).json({ 'message': 'OTP is invalid.' });
    return res.status(200).json({ 'message': 'OTP verification success.' });

}

const deleteOTP = async (req, res) => {
    try {
        await OTP.deleteOne({email_address: req.body.email}).exec();
    }
    catch (error){
        res.status(400).json(error.message);
    }
}

module.exports = {
    sendOTP,
    verifyOTP,
    deleteOTP
}