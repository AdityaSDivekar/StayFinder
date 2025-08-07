const Listing = require('../../models/Listing');

const getAllListingsService = async (location, page = 1, limit = 8) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);

  let query = Listing.find();
  if (location) {
    query = Listing.findByLocation(location);
  }

  return await query
    .skip(skip)
    .limit(parseInt(limit))
    .populate('host', 'name');
};


module.exports = getAllListingsService;