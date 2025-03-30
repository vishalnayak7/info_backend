import express from 'express';
import { EmailVerify, googleCallback, login_handler, signup_handler, verfiy_token } from '../controllers/auth.controller.js';
import passport from 'passport';
import { authLimiter } from '../utilites/helperFunctions.js';


let router = express.Router();

// for google Oauth page
router.get("/google/auth", passport.authenticate('google', { scope: ['profile', 'email'] }));


// google callback Oauth handler
router.get("/google/callback", passport.authenticate('google', { session: false }), googleCallback);
 
// auth without google's Oauth
router.post("/login", authLimiter, login_handler);
router.post("/register", authLimiter, signup_handler);
router.post('/verify', verfiy_token);
router.post('/emailVerify/:token', authLimiter, EmailVerify);

// setup for authenticated routes
// routes for role base access



export const AuthRouter = router;