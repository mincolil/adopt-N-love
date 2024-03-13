const express = require('express')
const router = express.Router()
const bookingDetailController = require('../controllers/bookingDetailController')

router.get('/:bookingId', bookingDetailController.getBookingDetailByBookingId)
    .post('/:bookingId', bookingDetailController.createBookingDetail) //test
    .delete('/:id', bookingDetailController.deleteOrderDetail)
    .get('/history/:petId', bookingDetailController.getBookingDetailByPetId)
    .get('/bookingDate/:bookingDate', bookingDetailController.getBookingDetailByBookingDate)
    .get('/:petId/:bookingDate', bookingDetailController.getBookingDetailByBookingDateAndPetId)

module.exports = router 