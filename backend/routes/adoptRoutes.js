const express = require('express');
const router = express.Router();
const adoptController = require('../controllers/adoptController');


router.get('/', adoptController.getAllAdopt)
    .post('/', adoptController.createNewAdopt)
    .patch('/', adoptController.updateAdopt)
    .get('/userid', adoptController.getAdoptByUserId)
    .put('/updateStatus', adoptController.updateStatus)
    .delete('/:id', adoptController.deleteOne)

module.exports = router;