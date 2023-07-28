const express = require('express');
const router = express.Router();
const otpController = require('../../controller/otpController');

router.route('/send')
  .post(otpController.sendOTP);

router.route('/verify')
  .post(otpController.verifyOTP);

// router.route('/')
//   .delete(otpController.deleteOTP);


module.exports = router;