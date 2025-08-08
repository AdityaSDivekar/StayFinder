const asyncHandler = require('../../utils/async/asyncHandler');
const verifyEmailService = require('../../services/auth/verifyEmail');

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const data = await verifyEmailService(token);
  res.status(200).json({ success: true, data });
});
