const express = require('express');
const router = express.Router();

const authRoutes = require('./api/auth');
const listingRoutes = require('./api/listings');
const bookingRoutes = require('./api/bookings');
const userRoutes = require('./api/user');

router.use('/api/auth', authRoutes);
router.use('/api/listings', listingRoutes);
router.use('/api/bookings', bookingRoutes);
router.use('/api/user', userRoutes);

const adminRoutes = require('./api/admin');
router.use('/api/admin', adminRoutes);

module.exports = router;