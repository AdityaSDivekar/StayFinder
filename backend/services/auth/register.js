const User = require('../../models/User');
const sendEmail = require('../../utils/email/sendEmail');

const registerService = async ({ name, email, password }) => {
  const user = await User.create({ name, email, password });

  const verificationToken = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `http://localhost:3000/verify-email/${verificationToken}`;
  const message = `Please verify your email by clicking on the following link: ${verificationUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message,
    });
    return {
      message: 'Verification email sent.',
    };
  } catch (err) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error('Email could not be sent');
  }
};

module.exports = registerService;