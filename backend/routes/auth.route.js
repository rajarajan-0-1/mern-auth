const express = require('express');
const { signUp, logIn, logOut, verifyEmail, forgotPassword, resetPassword, checkAuth } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', signUp);

router.post('/login', logIn);

router.post('/logout', logOut);

router.post('/verify-email', verifyEmail);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

module.exports = router;