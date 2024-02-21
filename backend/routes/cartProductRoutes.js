const express = require('express')
const router = express.Router()
const cartProductController = require('../controllers/cartProductController')

router.get('/view-cart', cartProductController.viewCart) //test
    .post('/checkout', cartProductController.checkout) //test
    .post('/add-to-cart', cartProductController.addToCart) //test
    .delete('/remove-from-cart/:productId', cartProductController.removeFromCart)

module.exports = router   