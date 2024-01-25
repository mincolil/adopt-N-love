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

const getAdoptByUserId = async (req, res) => {
    //get adoptpet by userId
    try {
        const { userId } = req.body
        const result = await AdoptPet.find({ userId: userId })
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

//update status
const updateStatus = async (req, res) => {
    try {
        const { id, status } = req.body
        const updateStatus = await AdoptPet.findOneAndUpdate(
            { _id: id },
            { $set: { status: status } },
            { new: true }
        )
        res.json(updateStatus)
    } catch (error) {
        console.log(error)
        res.json({ error: "Internal Server Error" })
    }

}

const deleteOne = async (req, res) => {
    try {
        const { id } = req.params
        const result = await AdoptPet.findByIdAndDelete(id)
        if (!result) return res.json({
            error: "No adopt pet found"
        })
        res.status(200).json({
            message: `Deleted ${result.petName}`
        })
    } catch (error) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

module.exports = {
    createNewAdopt,
    getAllAdopt,
    getAdoptByUserId,
    updateStatus,
    deleteOne
}