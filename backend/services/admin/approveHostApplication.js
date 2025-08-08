const HostApplication = require('../../models/HostApplication');
const User = require('../../models/User');

const approveHostApplicationService = async (applicationId) => {
  const application = await HostApplication.findById(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }

  if (application.status !== 'pending') {
    throw new Error(`Application is already ${application.status}`);
  }

  const user = await User.findById(application.user);
  if (!user) {
    throw new Error('User not found');
  }

  user.isHost = true;
  await user.save();

  application.status = 'approved';
  await application.save();

  return { message: 'Host application approved successfully.' };
};

module.exports = approveHostApplicationService;
