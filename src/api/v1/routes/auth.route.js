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
router.post('/login', authValidation.login, postController.login);

module.exports = router;
