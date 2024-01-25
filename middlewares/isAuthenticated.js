const passport = require('../config/passportconfig');

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = {
    requireAuth 
} 

