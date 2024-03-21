const { ca } = require('date-fns/locale')
const AdoptPet = require('../models/AdoptPet')
const Pet = require('../models/Pet')
const User = require('../models/User')
const AdoptNotification = require('../models/AdoptNotification')

const createNewAdopt = async (req, res) => {
    try {
        const { userId, petName, age, species, weight, height, petImage, vaccine, sterilization, rabies, toilet, childFriendly, petFriendly } = req.body
        const adoptPet = new AdoptPet({
            userId,
            petName,
            age,
            species,
            weight,
            height,
            petImage,
            vaccine,
            sterilization,
            rabies,
            toilet,
            childFriendly,
            petFriendly
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

// const getAllAdopt = async (req, res) => {
//     try {
//         const { page, limit, petName, sort } = req.query

//         const query = {}

//         if (petName) {
//             query.petName = { $regex: new RegExp(petName, 'i') }
//         }

//         const options = {
//             page: parseInt(page, 10) || 1,
//             limit: parseInt(limit, 10) || 10,
//             sort: { createdAt: -1 }, // mắc định sắp xếp theo thời gian gần đây nhất
//         }

//         if (sort === 'acs') {
//             options.sort = 1
//         }
//         if (sort === 'desc') {
//             options.sort = -1
//         }

//         const result = await AdoptPet.paginate(query, options)
//         if (!result) return res.json({
//             error: "No adopt pet found"
//         })
//         res.status(200).json({
//             result,
//             "query": query
//         })
//     } catch (error) {
//         console.log(err)
//         res.status(500).json({
//             error: err
//         })
//     }
// }

//get all adopt pet that forAdoption = true
const getAllAdopt = async (req, res) => {
    try {
        const { page, limit, categoryId } = req.query

        const query = {
            forAdoption: true
        }

        if (categoryId) {
            query.categoryId = categoryId;
        }

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        }

        const result = await Pet.paginate(query, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            populate: {
                path: 'userId',
                model: 'User',
                select: 'fullname phone',
            }
        })

        if (!result || result.docs === 0) {
            return res.status(404).json({
                error: "There are no Pet available for adoption in the Database",
            });
        }
        res.status(200).json(result);

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const getAdoptByUsername = async (req, res) => {
    try {
        const searchTerm = req.query.name || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Find the user based on the provided username
        const users = await User.find({ fullname: new RegExp(searchTerm, 'i') });

        // Extract the user IDs from the found users
        const userIds = users.map(user => user._id);

        // Find pets where userId is in the list of found user IDs and forAdoption is true
        const petPaginateResult = await Pet.paginate({ userId: { $in: userIds }, forAdoption: true }, {
            page, limit, populate: {
                path: 'userId',
                model: 'User',
                select: 'fullname phone',
            }
        });

        res.json(petPaginateResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAdoptByPetName = async (req, res) => {
    try {
        const searchTerm = req.query.name || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const { petName } = req.query

        const result = await Pet.paginate({ petName: { $regex: new RegExp(petName, 'i') }, forAdoption: true }, {
            page, limit, populate: {
                path: 'userId',
                model: 'User',
                select: 'fullname phone',
            }
        });
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

const updateAdopt = async (req, res) => {
    try {
        const { id, userId, petName, age, species, weight, height, petImage, vaccine, sterilization, rabies, toilet, childFriendly, petFriendly } = req.body
        const adoptPet = await AdoptPet.findById(id)
        adoptPet.userId = userId
        adoptPet.petName = petName
        adoptPet.age = age
        adoptPet.species = species
        adoptPet.weight = weight
        adoptPet.height = height
        adoptPet.petImage = petImage
        adoptPet.vaccine = vaccine
        adoptPet.sterilization = sterilization
        adoptPet.rabies = rabies
        adoptPet.toilet = toilet
        adoptPet.childFriendly = childFriendly
        adoptPet.petFriendly = petFriendly

        await adoptPet.save()
        res.status(201).json({
            message: `Updated ${petName}`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const getAdoptById = async (req, res) => {
    try {
        const { adoptId } = req.params
        //find the result that id = adoptId and forAdoption = true
        const result = await Pet.findOne({ _id: adoptId, forAdoption: true })

        if (!result) return res.json({
            error: "No adopt pet found"
        })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

const createAdoptNotification = async (req, res) => {
    try {
        const { userId, petId } = req.body
        const adoptNotification = new AdoptNotification({
            userId,
            petId,
            status: "PENDING"
        })
        const result = await adoptNotification.save()
        if (result) {
            res.status(201).json({
                message: `Created adopt notification`
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

module.exports = {
    createNewAdopt,
    getAllAdopt,
    getAdoptByUserId,
    updateStatus,
    deleteOne,
    updateAdopt,
    getAdoptById,
    getAdoptByUsername,
    getAdoptByPetName,
    createAdoptNotification
}