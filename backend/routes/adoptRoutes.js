const express = require('express');
const router = express.Router();
const adoptController = require('../controllers/adoptController');


router.get('/', (res, req) => { res.send('Hello World') })
    .post('/create-new-adopt', adoptController.createNewAdopt)

module.exports = router;