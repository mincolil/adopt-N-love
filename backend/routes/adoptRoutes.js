const express = require('express');
const router = express.Router();
const adoptController = require('../controllers/adoptController');


router.get('/', adoptController.getAllAdopt)
    .get('/:adoptId', adoptController.getAdoptById)
    .get('/petname', adoptController.getAdoptByPetName)
    .post('/', adoptController.createNewAdopt) //test
    .patch('/', adoptController.updateAdopt)//test
    .get('/username', adoptController.getAdoptByUsername)
    .get('/userid', adoptController.getAdoptByUserId)
    .put('/updateStatus', adoptController.updateStatus)
    .delete('/:id', adoptController.deleteOne)


module.exports = router;