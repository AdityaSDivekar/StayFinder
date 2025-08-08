const sendEmail = async (options) => {
  console.log('--- Mock Email Start ---');
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message: ${options.message}`);
  console.log('--- Mock Email End ---');
  return Promise.resolve();
};

module.exports = sendEmail;
