const express = require('express');
const { register, login, loggout, forgetPassword, ResetPass, setCookie,getProfile } = require('../controllers/Auth');
const Authenticated = require('../../middelwars/auth.middelware');
const { faker } = require('@faker-js/faker');
const { UserModel } = require('../models/user');

const router = express.Router();

// Route for user registration
router.post('/register', register);

//imp  routes
router.post('/setCookie', setCookie);


// Route for user login
router.post('/login', login);

router.post('/loggout', Authenticated, loggout);
router.get('/getProfile', Authenticated, getProfile);

router.post('/forgetpassword', Authenticated, forgetPassword);

router.post('/reset-password/:token', ResetPass);

module.exports = router;

