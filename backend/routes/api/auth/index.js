const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { register } = require('../../../controllers/auth/registerController');
const { login } = require('../../../controllers/auth/loginController');
const { getMe } = require('../../../controllers/auth/getMeController');
const { verifyEmail } = require('../../../controllers/auth/verifyEmailController');
const protect = require('../../../middleware/auth/protect');

router.get('/verify-email/:token', verifyEmail);
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
