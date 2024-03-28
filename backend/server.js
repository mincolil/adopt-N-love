require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-google-oauth2').Strategy;
const PORT = process.env.PORT || 3500;
const MONGO_URI = process.env.MONGO_URI;
const userdb = require('./models/User');
const { ca } = require('date-fns/locale');
const jwt = require('jsonwebtoken')

const clientid = "424228344980-l67mummet93pgl903qru8ejvjeoo098s.apps.googleusercontent.com";
const clientserver = "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"
const bookingController = require('../backend/controllers/bookingController');
const router = require('./routes/bookingRoutes');

app.use(express.json({
    limit: '5mb',
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));
app.use(cookieParser());
// tell nodejs to access static file in public folder
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000", "http://localhost:3001"]
    })
)

app.use(session({
    secret: "17092002minhdule",
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy({
    clientID: clientid,
    clientSecret: clientserver,
    callbackURL: "http://localhost:3500/auth/google/callback",
    scope: ["profile", "email"],
    passReqToCallback: true
},
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            let user = await userdb.findOne({ email: profile.email });
            if (!user) {
                user = new userdb({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value
                });
                await user.save();
            }
            // Send token back to client
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((id, done) => {
    done(null, user);
})

app.get('/auth/google', passport.authenticate('google', { scope: ["profile", "email"] }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: 'http://localhost:3000', failureRedirect: 'http://localhost:3000/login' }));

app.get("/login/sucess", async (req, res) => {

    if (req.user) {
        res.status(200).json({ message: "user Login", user: req.user })
    } else {
        res.status(400).json({ message: "Not Authorized" })
    }
})

app.get('/', (req, res) => {
    return res.send('Hello World')
})

app.use('/role', require('./routes/roleRoutes'))
app.use('/user', require('./routes/userRoutes'))
app.use('/', require('./routes/authRoutes'))
app.use('/service', require('./routes/serviceRoutes'))
app.use('/product', require('./routes/productRoutes'))
app.use('/pet', require('./routes/petRoutes'))
app.use('/category', require('./routes/categoryRoutes'))
app.use('/order', require('./routes/orderRoutes'))
app.use('/orderDetail', require('./routes/orderDetailRoutes'))
app.use('/booking', require('./routes/bookingRoutes'))
app.use('/bookingDetail', require('./routes/bookingDetailRoutes'))
app.use('/cartService', require('./routes/cartServiceRoutes'))
app.use('/cartProduct', require('./routes/cartProductRoutes'))
app.use('/dashboard', require('./routes/dashBoardRoutes'))
app.use('/feedback', require('./routes/feedbackRoutes'))
app.use('/blog', require('./routes/blogRoutes'))
app.use('/serviceDashboard', require('./routes/serviceDashBoardRoutes'))
app.use('/adopt', require('./routes/adoptRoutes'))
app.use('/medical', require('./routes/medicalReportRoutes'))


app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.join({ message: "404 Not Found" })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log(`Server starting at http://localhost:${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err);
    })

module.exports = app
