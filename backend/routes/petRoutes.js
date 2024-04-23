const express = require('express')
const router = express.Router()
const petController = require('../controllers/petController')
const multer = require('multer')
const validatePet = require('../middleware/validatePetInput')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/pet'); // Specify the folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname;
        cb(null, `${originalName}`); // Keep the original file name
    },
});

const upload = multer({ storage: storage });

router.get('/', petController.getAll)
    .post('/', validatePet.validateCreatePet, petController.createPet) //test
    .patch('/', validatePet.validateUpdatePet, petController.updatePet) //test
    .get('/username', petController.getPetByUsername) //test
    .get('/userid', petController.getPetByUserId) //test
    .put('/updateStatus', petController.updateStatus)
    .post('/upload', upload.single('image'), petController.uploadPetImage)
    .post('/booking', petController.getPetListForServiceBooking)
    .delete('/:id', petController.deleteOne)
    .patch('/adopt', petController.adoptPet)
module.exports = router