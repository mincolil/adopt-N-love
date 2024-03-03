const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')
const validateBooking = require('../middleware/validateBookingInput')

router.get('/', bookingController.getAllBooking) //test
    .get('/get-all-booking-by-uid/:userId', bookingController.getAllBookingByUserId) //test
    .get('/get-booking', bookingController.getBooking)
    .post('/', validateBooking.validateCreateBooking, bookingController.createBooking) //test
    .put('/:bookingId', validateBooking.validateUpdateBooking, bookingController.updateBooking) //test
    .put('/update-status/:bookingId', bookingController.updateStatus)
    .delete('/:bookingId', bookingController.deleteBooking)

module.exports = router    