const express = require('express');
const router = express.Router();
const { register, emailConformation } = require('../controller/registerController');
const { login, userProfile, authenticateToken, acknowledgment } = require('../controller/loginController');
router.post('/register', register);
router.get('/email-conformation', emailConformation);
router.post('/login', login);
router.get('/userProfile', authenticateToken, userProfile);
router.post('/acknowledgment', acknowledgment);
module.exports = router;