const express = require('express')
const router = express.Router()
const cartServiceController = require('../controllers/cartServiceController')

router.get('/view-cart/', cartServiceController.viewCart) //test
    .post('/checkout', cartServiceController.checkout) //test
    .post('/add-to-cart', cartServiceController.addToCart) //test
    .delete('/remove-from-cart/:serviceId', cartServiceController.removeFromCart)
    .get('/bookingDate/:bookingDate', cartServiceController.getCartServiceByBookingDate)

module.exports = router   