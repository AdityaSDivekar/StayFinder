const express = require('express');
const router = express.Router();

router.use('/create', require('./create'));
router.use('/user', require('./user'));

module.exports = router;
