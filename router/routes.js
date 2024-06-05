const express = require('express');
const auth = require('../auth/auth.js');

const { Register, 
        Login, 
        CheckNearbyRestaurants, 
        MovementsRecord,
        Logout } = require('../controllers/controllers.js')

const router = express.Router();

router.get('/login', Login);
router.post('/register', Register);
//Protected routes that need authentication
router.get('/logout', auth, Logout);
router.get('/restaurants', auth, CheckNearbyRestaurants);
router.get('/record', auth, MovementsRecord);

module.exports = router;