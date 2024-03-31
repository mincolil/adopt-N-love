const express = require('express')
const router = express.Router()
const bookingDetailController = require('../controllers/bookingDetailController')

router.get('/', bookingDetailController.getAllBookingDetail)
    .get('/:bookingId', bookingDetailController.getBookingDetailByBookingId)
    .patch('/:id', bookingDetailController.updateBookingDetail)
    .post('/:bookingId', bookingDetailController.createBookingDetail) //test
    .delete('/:id', bookingDetailController.deleteOrderDetail)
    .get('/history/:petId', bookingDetailController.getBookingDetailByPetId)
    .get('/bookingDate/:bookingDate', bookingDetailController.getBookingDetailByBookingDate)
    .get('/:petId/:bookingDate', bookingDetailController.getBookingDetailByBookingDateAndPetId)

module.exports = router 