const passport = require('passport');

exports.authenticateGoogle = passport.authenticate('google', {
    scope: ['profile', 'email']
});