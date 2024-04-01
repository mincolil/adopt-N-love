const CartService = require('../models/CartService');
const Service = require('../models/Service')
const Booking = require('../models/Booking');
const BookingDetail = require('../models/BookingDetail');
const jwt = require('jsonwebtoken');
const Pet = require('../models/Pet');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
let endpointSecret = "whsec_c29f4e9b61dc83ebf1bfdf2b9d16e971b443576807c28f8647222d9ae757309c";

const viewCart = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const cartItems = await CartService.find({ userId }).populate('petId').populate('serviceId').populate('userId');
        res.status(200).json(cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

const addToCart = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        // const token = req.cookies.token;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const { serviceId, petId, quantity, bookingDate } = req.body;

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.json({
                error: 'Service: ' + serviceId + ' not found.'
            });
        }

        let cartService = await CartService.findOne({ userId, serviceId, petId });

        if (cartService) {
            cartService.quantity += quantity;
        } else {
            cartService = new CartService({
                userId,
                petId,
                serviceId,
                quantity: quantity,
                bookingDate
            });
        }
        const result = await cartService.save();
        res.json({
            message: 'Add service ' + serviceId + ' to cart success!',
            result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

const removeFromCart = async (req, res) => {
    // Lấy thông tin người dùng từ token JWT
    // const token = req.cookies.token;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;
    const serviceId = req.params.serviceId;
    const service = await CartService.findOne({ serviceId });
    if (!service) {
        return res.status(404).json({ message: 'Service: ' + serviceId + ' not found.' });
    }
    try {
        // Xóa dịch vụ khỏi giỏ hàng của người dùng
        await CartService.findOneAndRemove({ userId, serviceId });
        res.status(200).json({ message: 'The service has been removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while removing the service from cart' });
    }
}

const checkout = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        // const token = req.cookies.token;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const cartItems = await CartService.find({ userId });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create a new booking record
        let total = 0;
        const booking = new Booking({
            userId: userId,
            totalPrice: total,
            status: 'Chờ xác nhận',
            recipientName: req.body.recipientName,
            recipientPhoneNumber: req.body.recipientPhoneNumber,
        });
        const createdBooking = await booking.save();

        // Create booking details for each cart item
        for (const cartItem of cartItems) {

            const service = await Service.findById(cartItem.serviceId);

            if (service) {
                const bookingDetail = new BookingDetail({
                    bookingId: createdBooking._id,
                    petId: cartItem.petId,
                    serviceId: cartItem.serviceId,
                    quantity: cartItem.quantity,
                    bookingDate: cartItem.bookingDate,
                });

                await bookingDetail.save();
                //get discount value of pet
                const pet = await Pet.findById(cartItem.petId);
                let petDiscount = 0;
                if (pet) {
                    petDiscount = pet.discount;
                }
                let finalPrice = (service.discountedPrice) - (service.price * petDiscount / 100);
                if (finalPrice < (0.7 * service.price)) {
                    finalPrice = 0.7 * service.price;
                }


                // Update the total price
                total += finalPrice * cartItem.quantity;
            }
        }

        // Update the booking's total price
        createdBooking.totalPrice = total;
        await createdBooking.save();

        // Remove all cart items for the user
        await CartService.deleteMany({ userId });

        res.status(200).json({
            message: 'Checkout successful',
            booking: createdBooking,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err, message: 'Can not checkout' });
    }

}

const getCartServiceByBookingDate = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;
        const bookingDate = req.params.bookingDate;

        const cartItems = await CartService.find({ userId, bookingDate }).populate('petId').populate('serviceId').populate('userId');
        res.status(200).json(cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

const checkoutStripe = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const cartItems = await CartService.find({ userId });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let total = 0;

        line_items = []
        for (const cartItem of cartItems) {


            const service = await Service.findById(cartItem.serviceId);



            if (service) {
                const pet = await Pet.findById(cartItem.petId);
                let petDiscount = 0;
                if (pet) {
                    petDiscount = pet.discount;
                }
                let finalPrice = (service.discountedPrice) - (service.price * petDiscount / 100);
                if (finalPrice < (0.7 * service.price)) {
                    finalPrice = 0.7 * service.price;
                }
                total += finalPrice * cartItem.quantity;

                //add line item for stripe
                line_items.push({
                    price_data: {
                        currency: 'VND',
                        product_data: {
                            name: service.serviceName,
                        },
                        unit_amount: finalPrice,
                    },
                    quantity: cartItem.quantity,
                });
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: line_items,
            metadata: {
                userId: userId,
                recipientName: req.body.recipientName,
                recipientPhoneNumber: req.body.recipientPhoneNumber,
                //list of cart items
                cartServiceItems: JSON.stringify(cartItems),
            },
            success_url: 'http://localhost:3000/service-purchase',
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.status(200).json({
            message: 'Checkout successful',
            // order: createdOrder,
            url: session.url
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err, message: 'Can not checkout' });
    }
}


const getCartServiceByBookingDateAndPetId = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;
        const bookingDate = req.params.bookingDate;
        const petId = req.params.petId;

        const cartItems = await CartService.find({ userId, bookingDate, petId }).populate('petId').populate('serviceId').populate('userId');
        res.status(200).json(cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

module.exports = {
    addToCart,
    removeFromCart,
    viewCart,
    checkout,
    getCartServiceByBookingDate,
    getCartServiceByBookingDateAndPetId,
    checkoutStripe
}