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
    try {
        const { title, page, limit, sort } = req.query

        const query = {}
        if (!title) {
            query.title = { $regex: new RegExp(title, 'i') }
        }
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { createdAt: -1 }, // mắc định sắp xếp theo thời gian gần đây nhất
            populate: 'userId',
        }
        if (sort === 'acs') {
            options.sort = 1
        }
        if (sort === 'desc') {
            options.sort = -1
        }
        const blogs = await Blog.paginate(query, options)
        if (!blogs) {
            res.status(204).json({ error: "There are no blog in database" })
        } else res.status(200).json(blogs)
    } catch (error) {
        console.log(error)
        res.json({ error: "Internal Server Error" })
    }

}

module.exports = {
    createNewAdopt,
    getAllAdopt
}