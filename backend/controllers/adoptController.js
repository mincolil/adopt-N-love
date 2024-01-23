const AdoptPet = require('../models/AdoptPet')

const createNewAdopt = async (req, res) => {
    try {
        const { userId, petName, age, species, weight, height, petImage } = req.body
        const adoptPet = new AdoptPet({
            userId,
            petName,
            age,
            species,
            weight,
            height,
            petImage
        })
        const result = await adoptPet.save()
        if (result) {
            res.status(201).json({
                message: `Created ${petName}`
            })
        } else {
            res.status(400).json({
                error: "Create fail"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

const getAllAdopt = async (req, res) => {
    //get all adoptpet
    try {
        const result = await AdoptPet.find()
        if (!result) return res.json({
            error: "No adopt pet found"
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

module.exports = {
    createNewAdopt,
    getAllAdopt
}