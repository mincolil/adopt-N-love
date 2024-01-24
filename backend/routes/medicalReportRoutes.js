const express = require('express')
const router = express.Router()
const medicalController = require('../controllers/medicalController')

router.get('/', medicalController.getAllMedical)
    .post('/create', medicalController.createNewMedical)
    .post('/update', medicalController.updateMedical)
    .delete('/:id', medicalController.deleteMedical)
    .get('/:id', medicalController.getMedicalById)

module.exports = router