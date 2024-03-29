const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const validateAuth = require('../middleware/validateAuthInput')
const passport = require('passport');
const { authenticateGoogle } = require('../middleware/authMiddleware');

router.post('/login', validateAuth.validateLoginData, authController.login)
    .get('/logout', authController.logout)
    .post('/google', authController.loginGoogle)
    .get('/check', authController.check)
    .post('/register', validateAuth.validateRegisterData, authController.register)
    .put('/changePassword', authController.changePassword)
    .get('/profile', authController.getProfile)
    .post('/forgot-password', authController.forgotPassword)
    .post('/verify', authController.verify)
    .post('/new-password', authController.newPassword)

module.exports = router