const express = require('express')
const router = express.Router()
const medicalController = require('../controllers/medicalController')

router.get('/', medicalController.getAllMedical)
    .post('/create', medicalController.createNewMedical) //test
    .get('/user/:userId', medicalController.getMedicalByUserId)

module.exports = router