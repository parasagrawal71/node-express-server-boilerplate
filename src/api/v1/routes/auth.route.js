const express = require('express');

// CUSTOM IMPORTS
const { authValidation } = require('api/v1/validations');

const router = express.Router();

// IMPORT CONTROLLERS HERE
const postController = require('../controllers/auth/auth.post');
const getController = require('../controllers/auth/auth.get');
const putController = require('../controllers/auth/auth.put');
const deleteController = require('../controllers/auth/auth.delete');
const patchController = require('../controllers/auth/auth.patch');

// ROUTES HERE
router.post('/register', authValidation.register, postController.register);
router.get('/account-verification', authValidation.accountVerification, getController.accountVerification);
router.patch('/resend-verification-email', authValidation.resendVerificationEmail, patchController.resendVerificationEmail);
router.get('/login', authValidation.login, getController.login);
router.get('/google-login', authValidation.googleLogin, getController.googleLogin);
router.patch('/set-password', authValidation.setPassword, patchController.setPassword);
router.patch('/forgot-password', authValidation.handleForgotPassword, patchController.handleForgotPassword);
router.patch('/verify-email', authValidation.verifyEmailAddress, patchController.verifyEmailAddress);

module.exports = router;
