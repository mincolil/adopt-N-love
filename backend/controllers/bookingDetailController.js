const BookingDetail = require('../models/BookingDetail');
const mongoose = require('mongoose')

const getBookingDetailByBookingId = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        const bookingDetails = await BookingDetail.aggregate([
            {
                $match: { bookingId: new mongoose.Types.ObjectId(bookingId) }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $unwind: "$service"
            },
            {
                $lookup: {
                    from: 'pets',
                    localField: 'petId',
                    foreignField: '_id',
                    as: 'pet'
                }
            },
            {
                $unwind: "$pet"
            },
            {
                $addFields: {
                    isWithinSale: {
                        $and: [
                            { $gte: ["$createdAt", "$service.saleStartTime"] },
                            { $lte: ["$createdAt", "$service.saleEndTime"] }
                        ]
                    },
                    discountedPrice: {
                        $cond: {
                            if: {
                                $and: [
                                    "$service.saleStartTime",
                                    "$service.saleEndTime",
                                    { $gte: ["$createdAt", "$service.saleStartTime"] },
                                    { $lte: ["$createdAt", "$service.saleEndTime"] }
                                ]
                            },
                            then: {
                                $multiply: [
                                    "$quantity",
                                    { $subtract: ["$service.price", { $multiply: ["$service.price", { $divide: ["$service.discount", 100] }] }] }
                                ]
                            },
                            else: { $multiply: ["$quantity", "$service.price"] }
                        }
                    }
                }
            },
            {
                $project: {
                    bookingId: 1,
                    petId: 1,
                    serviceId: 1,
                    quantity: 1,
                    price: "$discountedPrice",
                    service: 1,
                    pet: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    bookingDate: 1
                }
            },
            //bookingDate
        ]);

        if (!bookingDetails || bookingDetails.length === 0) {
            return res.status(404).json({ message: 'BookingDetail not found!' });
        }

        res.status(200).json(bookingDetails);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const createBookingDetail = async (req, res) => {
    try {
        const { serviceId, petId, quantity, bookingDate } = req.body;
        const bookingId = req.params.bookingId;
        const newBookingDetail = new BookingDetail({ bookingId, serviceId, petId, quantity, bookingDate });
        const result = await newBookingDetail.save();
        if (!result) {
            return res.status(404).json({
                error: "Can not create BookingDetail"
            })
        }
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const deleteOrderDetail = async (req, res) => {
    try {
        const { id } = req.params
        const result = await BookingDetail.findByIdAndDelete(id)
        if (!result) {
            res.status(400).json({ error: "Gặp lỗi không xóa được" });
        } else {
            res.status(201).json({ message: "Xóa sản phẩm thành công" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log(error)
    }
}

const getBookingDetailByPetId = async (req, res) => {
    try {
        const petId = req.params.petId;
        const query = { petId }; // Add bookingDate to the query
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            populate: 'serviceId bookingId',
        };

        const result = await BookingDetail.paginate(query, options);

        if (result.docs.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get booking detail by booking date
const getBookingDetailByBookingDate = async (req, res) => {
    try {
        const bookingDate = req.params.bookingDate;
        const query = { bookingDate };
        const options = {
            page: parseInt(req.query.page) || 1, // Parse query parameters for pagination
            limit: parseInt(req.query.limit) || 10,
            populate: 'serviceId petId bookingId', // Specify the field to populate
        };

        const result = await BookingDetail.paginate(query, options);

        if (result.docs.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getBookingDetailByBookingDateAndPetId = async (req, res) => {
    try {
        const bookingDate = req.params.bookingDate;
        const petId = req.params.petId;
        const query = { bookingDate, petId };
        const options = {
            page: parseInt(req.query.page) || 1, // Parse query parameters for pagination
            limit: parseInt(req.query.limit) || 10,
            populate: 'serviceId bookingId', // Specify the field to populate
        };

        const result = await BookingDetail.paginate(query, options);

        if (result.docs.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getBookingDetailByBookingId,
    createBookingDetail,
    deleteOrderDetail,
    getBookingDetailByPetId,
    getBookingDetailByBookingDate,
    getBookingDetailByBookingDateAndPetId
}