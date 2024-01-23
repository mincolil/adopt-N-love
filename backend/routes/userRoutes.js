const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const validateProfile = require('../middleware/validateProfileInput')
const validateUser = require("../middleware/validateUserInput")

router.post('/', validateUser.validateUserInput, usersController.createUser)
    .patch('/', validateProfile.validatePhoneNumberInput, usersController.updateUser) // update user dành cho admin
    .patch('/updateProfile', validateProfile.validatePhoneNumberInput, usersController.updateUser) // update profile
    .delete('/:id', usersController.deleteOne)
    .get('/:id', usersController.getUserById)
    .get('/', usersController.getAll)

module.exports = router