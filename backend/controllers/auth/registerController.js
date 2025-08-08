const asyncHandler = require('../../utils/async/asyncHandler');
const registerService = require('../../services/auth/register');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const data = await registerService({ name, email, password });
  res.status(201).json({ success: true, data });
});