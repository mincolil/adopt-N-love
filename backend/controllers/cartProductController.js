const CartProduct = require('../models/CartProduct');
const Product = require('../models/Product')
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const jwt = require('jsonwebtoken');
const e = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
let endpointSecret = "whsec_c29f4e9b61dc83ebf1bfdf2b9d16e971b443576807c28f8647222d9ae757309c";

const viewCart = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const cartItems = await CartProduct.find({ userId }).populate('productId').populate('userId');
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

        const productId = req.body.productId;
        const quantity = req.body.quantity;

        const product = await Product.findById(productId);

        if (!product) {
            return res.json({
                error: 'Product: ' + productId + ' not found.'
            });
        }

        let cartProduct = await CartProduct.findOne({ userId, productId });

        if (cartProduct) {
            cartProduct.quantity += quantity;
        } else {
            cartProduct = new CartProduct({
                userId: userId,
                productId: productId,
                quantity: quantity
            });
        }
        const result = await cartProduct.save();
        res.json({
            message: 'Add product ' + productId + ' to cart success!',
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
    const productId = req.params.productId;
    const product = await CartProduct.findOne({ productId });
    if (!product) {
        return res.status(404).json({ message: 'Product: ' + productId + ' not found.' });
    }
    try {
        // Xóa sản phẩm khỏi giỏ hàng của người dùng
        await CartProduct.findOneAndRemove({ userId, productId });
        res.status(200).json({ message: 'The product has been removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while removing the product from cart' });
    }
}

const checkout = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        // const token = req.cookies.token;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const cartItems = await CartProduct.find({ userId });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create a new order record
        let total = 0;
        const order = new Order({
            userId: userId,
            totalPrice: total,
            status: 'Chờ xác nhận',
            recipientName: req.body.recipientName,
            recipientPhoneNumber: req.body.recipientPhoneNumber,
            deliveryAddress: req.body.deliveryAddress,
        });
        const createdOrder = await order.save();

        // Create booking details for each cart item
        for (const cartItem of cartItems) {

            const product = await Product.findById(cartItem.productId);

            if (product) {
                const orderDetail = new OrderDetail({
                    orderId: createdOrder._id,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                });

                await orderDetail.save();

                // Update the total price
                total += product.discountedPrice * cartItem.quantity;
            }
            product.quantity -= cartItem.quantity;
            await product.save();
        }

        // Update the booking's total price
        createdOrder.totalPrice = total;
        await createdOrder.save();

        // Remove all cart items for the user
        await CartProduct.deleteMany({ userId });

        res.status(200).json({
            message: 'Checkout successful',
            order: createdOrder,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err, message: 'Can not checkout' });
    }
}


const checkoutStripe = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const cartItems = await CartProduct.find({ userId });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let total = 0;

        line_items = []
        for (const cartItem of cartItems) {

            const product = await Product.findById(cartItem.productId);

            if (product) {
                total += product.discountedPrice * cartItem.quantity;

                //add line item for stripe
                line_items.push({
                    price_data: {
                        currency: 'VND',
                        product_data: {
                            name: product.productName,
                        },
                        unit_amount: product.discountedPrice,
                    },
                    quantity: cartItem.quantity,
                });
            }
            product.quantity -= cartItem.quantity;
            await product.save();
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            // line_items: req.body.lineItems,
            mode: 'payment',
            line_items: line_items,
            metadata: {
                userId: userId,
                recipientName: req.body.recipientName,
                recipientPhoneNumber: req.body.recipientPhoneNumber,
                deliveryAddress: req.body.deliveryAddress,
                //list of cart items
                cartItems: JSON.stringify(cartItems),
            },
            success_url: 'http://localhost:3000/product-purchase',
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

// Stripe webhook handler to handle successful payment
const handleStripePayment = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        console.log("webhook verifi");
    } catch (err) {
        console.error("error: " + err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log("tong gia tri: " + session.amount_total);

        // Here you can retrieve order details from the session object
        // and save them in your database
        let total = 0;
        const order = new Order({
            userId: session.metadata.userId,
            totalPrice: session.amount_total,
            status: 'Chờ xác nhận',
            recipientName: session.metadata.recipientName,
            recipientPhoneNumber: session.metadata.recipientPhoneNumber,
            deliveryAddress: session.metadata.deliveryAddress,
        });

        const createdOrder = await order.save();

        // You can also remove cart items here if needed
        // Create booking details for each cart item
        const parsedCartItems = JSON.parse(session.metadata.cartItems);


        for (const cartItem of parsedCartItems) {

            const product = await Product.findById(cartItem.productId);

            if (product) {
                const orderDetail = new OrderDetail({
                    orderId: createdOrder._id,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                });

                await orderDetail.save();

                // Update the total price
                total += product.discountedPrice * cartItem.quantity;
            }
            product.quantity -= cartItem.quantity;
            await product.save();
        }

        // Update the booking's total price
        createdOrder.totalPrice = total;
        await createdOrder.save();

        // Remove all cart items for the user
        const userId = session.metadata.userId;
        await CartProduct.deleteMany({ userId });

        res.status(200).json({
            message: 'Checkout successful',
            // order: createdOrder,
            received: true
        });
    }
};



//update cart's quantity
const updateCart = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        // const token = req.cookies.token;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const productId = req.body.productId;
        const quantity = req.body.quantity;

        const product = await Product.findById(productId);

        if (!product) {
            return res.json({
                error: 'Product: ' + productId + ' not found.'
            });
        }

        let cartProduct = await CartProduct.findOne({ userId, productId });

        if (cartProduct) {
            cartProduct.quantity = quantity;
        } else {
            cartProduct = new CartProduct({
                userId: userId,
                productId: productId,
                quantity: quantity
            });
        }
        const result = await cartProduct.save();
        res.json({
            message: 'Update product ' + productId + ' in cart success!',
            result
        });
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
    updateCart,
    checkoutStripe,
    handleStripePayment,
}