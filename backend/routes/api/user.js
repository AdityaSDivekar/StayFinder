const express = require('express');
const router = express.Router();
const protect = require('../../../middleware/auth/protect');
const { applyToBecomeHost } = require('../../../controllers/user/applyToBecomeHostController');

router.post('/apply-to-become-host', protect, applyToBecomeHost);

module.exports = router;
