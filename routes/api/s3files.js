const express = require('express');
const router = express.Router();
const path = require('path');
const s3filesController = require('../../controller/s3filesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    //.get(employeesController.getFile)
    .post(verifyRoles(ROLES_LIST.Admin), s3filesController.uploadFile)
    //.delete(verifyRoles(ROLES_LIST.Admin), s3filesController.deleteFile)

router.route('/:uniqueID')
    .get(verifyRoles(ROLES_LIST.Admin), s3filesController.getFile)

module.exports = router;