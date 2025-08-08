const express = require('express');
const router = express.Router();
const protect = require('../../../middleware/auth/protect');
const restrictToHost = require('../../../middleware/rbac/restrictToHost');
const restrictToOwner = require('../../../middleware/rbac/restrictToOwner');
const { getListings } = require('../../../controllers/listing/getListingsController');
const { getListing } = require('../../../controllers/listing/getListingController');
const { createListing } = require('../../../controllers/listing/createListingController');
const { updateListing } = require('../../../controllers/listing/updateListingController');
const { deleteListing } = require('../../../controllers/listing/deleteListingController');
const { getMyListings } = require('../../../controllers/listing/getMyListingsController');

router.get('/', getListings);
router.get('/my-listings', protect, restrictToHost, getMyListings);
router.get('/:id', getListing);
router.post('/', protect, restrictToHost, createListing);
router.put('/:id', protect, restrictToHost, restrictToOwner, updateListing);
router.delete('/:id', protect, restrictToHost, restrictToOwner, deleteListing);

module.exports = router;