const Booking = require('../models/Booking');
const BookingDetail = require('../models/BookingDetail');
const Pet = require('../models/Pet');

const getAllBooking = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (startDate && endDate) {
            const booking = await Booking.find({
                createdAt: {
                    $gte: new Date(startDate), // Ngày bắt đầu
                    $lte: new Date(endDate),   // Ngày kết thúc
                }
            }).populate('userId')
            res.status(200).json(booking)
        } else {
            const booking = await Booking.find().populate('userId')
            res.status(200).json(booking)
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }


}

const getBooking = async (req, res) => {
    try {
        const booking = await Booking.find().populate('userId')
        res.status(200).json(booking)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getBookingByPetId = async (req, res) => {
    try {
        const petId = req.params.petId;
        const { userId, status, startDate, endDate, sort, page, limit } = req.query;
        const query = {};
        // if (userId) {
        //     query.userId = userId;
        // }
        // if (status) { // duy sửa lại lọc booking = status
        //     query.status = status;
        // } else query.status = "Chờ xác nhận"
        // if (startDate && endDate) {
        //     query.createdAt = {
        //         $gte: new Date(startDate), // Ngày bắt đầu
        //         $lte: new Date(endDate),   // Ngày kết thúc
        //     };
        // }
        const options = {
            sort: { createdAt: -1 }, // Sắp xếp mặc định theo thời gian tạo giảm dần
            page: parseInt(page) || 1, // Trang mặc định là 1
            limit: parseInt(limit) || 10, // Giới hạn số lượng kết quả trên mỗi trang mặc định là 10
            populate: 'userId'
        };
        if (sort === 'asc') {
            options.sort = { totalPrice: 1 }; // Sắp xếp tăng dần theo totalPrice
        } else if (sort === 'desc') {
            options.sort = { totalPrice: -1 }; // Sắp xếp giảm dần theo totalPrice
        }
        const result = await Booking.paginate(query, options);
        if (!result.docs || result.docs.length === 0) {
            return res.status(404).json({
                error: "There are no Orders in the Database",
            });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}


const getAllBookingByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = await Booking.find({ userId }).populate('userId');
        if (!bookings) {
            return res.status(404).json({
                error: "UserId = :" + userId + " has no Bookings in the Database"
            })
        }
        res.status(200).json(bookings)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId).populate('userId');
        if (!booking) {
            return res.status(404).json({
                error: "Booking: " + bookingId + " not found!"
            })
        }
        res.status(200).json(booking)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const createBooking = async (req, res) => {
    try {
        // const { userId, petId, totalPrice } = req.body;
        const { userId, totalPrice } = req.body;
        const booking = new Booking();
        booking.userId = userId;
        // booking.petId = petId;
        booking.totalPrice = totalPrice;
        booking.status = 'Chờ xác nhận';
        const result = await booking.save();
        if (!result) {
            return res.status(404).json({
                error: "Can not create Booking"
            })
        }
        else res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { userId, petId, totalPrice, status } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                error: "Booking: " + bookingId + " not found!"
            })
        } else {
            booking.userId = userId;
            booking.petId = petId;
            booking.totalPrice = totalPrice;
            booking.status = status;
            const result = await booking.save();
            res.status(200).json(result)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                error: "Booking: " + bookingId + " not found!"
            })
        } else {
            const bookingDetails = await BookingDetail.find({ bookingId });
            if (bookingDetails != null) {
                await BookingDetail.deleteMany({ bookingId })
            }
            await Booking.findByIdAndRemove(bookingId);
            res.json({ message: 'Delete Booking success!' });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const updateStatus = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { bookingStatus } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                error: "Booking: " + bookingId + " not found!"
            })
        } else {
            booking.status = bookingStatus;
            const result = await booking.save();
            res.status(200).json(result)
            //level up pet if status = 'hoàn thành'
            if (bookingStatus === 'Hoàn thành') {
                const bookingDetails = await BookingDetail.find({ bookingId });
                if (bookingDetails != null) {
                    bookingDetails.forEach(async (bookingDetail) => {
                        const pet = await Pet.findById(bookingDetail.petId);
                        if (pet != null) {
                            pet.rank = pet.rank + 1;
                            if (pet.rank % 10 === 0) {
                                pet.discount = 10;
                            } else pet.discount = 0;
                            await pet.save();
                        }
                    })
                }
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}


module.exports = {
    getAllBooking,
    getAllBookingByUserId,
    createBooking,
    updateBooking,
    deleteBooking,
    updateStatus,
    getBooking,
    getBookingByPetId,
    getBookingById
}