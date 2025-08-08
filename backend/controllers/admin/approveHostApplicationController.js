const asyncHandler = require('../../utils/async/asyncHandler');
const approveHostApplicationService = require('../../services/admin/approveHostApplication');

exports.approveHostApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await approveHostApplicationService(id);
  res.status(200).json({ success: true, data });
});
