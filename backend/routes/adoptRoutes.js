const express = require('express');
const router = express.Router();
const adoptController = require('../controllers/adoptController');
const userController = require('../controllers/usersController');


router.get('/', adoptController.getAllAdopt)
    .post('/create-new-adopt', adoptController.createNewAdopt)

module.exports = router;