const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,

    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log("Transporter verify success")
    }
});


const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        return;
    }
    catch (error){
        throw error; 
    }
}


const generateOTP = async () => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
        return otp;
    }
    catch (error)
    {
        console.log(error);
    }
}

module.exports = {
    sendEmail,
    generateOTP
}