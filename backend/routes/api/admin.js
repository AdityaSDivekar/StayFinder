const express = require('express');
const router = express.Router();
const protect = require('../../../middleware/auth/protect');
const admin = require('../../../middleware/auth/admin');
const {
  approveHostApplication,
} = require('../../../controllers/admin/approveHostApplicationController');

router.put(
  '/host-applications/:id/approve',
  protect,
  admin,
  approveHostApplication
);

module.exports = router;
