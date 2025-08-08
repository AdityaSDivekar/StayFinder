const asyncHandler = require('../../utils/async/asyncHandler');
const applyToBecomeHostService = require('../../services/user/applyToBecomeHost');

exports.applyToBecomeHost = asyncHandler(async (req, res) => {
  const data = await applyToBecomeHostService(req.user.id);
  res.status(201).json({ success: true, data });
});
