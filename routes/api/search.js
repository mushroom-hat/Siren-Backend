const express = require('express');
const router = express.Router();
const path = require('path');
const searchController = require('../../controller/searchController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.TestUser), searchController.postCommand)


router.route('/:query')
.get(verifyRoles(ROLES_LIST.TestUser), searchController.getCommand)

module.exports = router;