const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')

router.get('/', categoryController.getAll)
    .post('/', categoryController.createCategory) //test
    .patch('/', categoryController.updateCategory) //test
    .delete('/:id', categoryController.deleteOne)
    .get('/catename/:name', categoryController.getCategoryByName)
module.exports = router