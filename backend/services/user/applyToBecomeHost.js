const HostApplication = require('../../models/HostApplication');

const applyToBecomeHostService = async (userId) => {
  const existingApplication = await HostApplication.findOne({ user: userId });
  if (existingApplication) {
    throw new Error('You have already submitted an application.');
  }

  const application = await HostApplication.create({ user: userId });
  return { application };
};

module.exports = applyToBecomeHostService;
