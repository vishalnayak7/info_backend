
import { logger } from '../config/logger.js';
import { USER_MODEL } from '../models/users.js';
import { asyncHandler } from '../utilites/asyncHandler.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env.js';
import { tr } from '@faker-js/faker';
import { slugify, transporter } from '../utilites/helperFunctions.js';



export const login_handler = asyncHandler(async (req, res) => {

     const { email, password } = req.body;

     if (email == "" || password == '') {
          return res.status(400).json({ status: false, message: 'Email and password are required' });
     }

     const user = await USER_MODEL.findOne({ email }).select('password avatar username accountType');

     if (!user || !await bcrypt.compare(password, user.password)) {
          return res.status(401).json({ status: false, message: 'Invalid credentials' });
     }

     const token = jwt.sign({ user_id: user._id, accountType: user.accountType, avatar: user.avatar, username: user.username }, ENV.jwtSecret, { expiresIn: '1d' });

     user.refreshToken = token;
     user.lastLogin = new Date();

     await user.save()
     logger.info(`${user.username} logged in`);
     // send notification of logged in user
     res.status(200).json({ token, username: user.username, avatar: user.avatar, accountType: user.accountType, authType: 'Login' });


}, "login");


// register without google Oauth
export const signup_handler = asyncHandler(async (req, res) => {

     const { username, email } = req.body;

     // all valid fields are required
     if (!username || !email) {
          throw new Error("Please provide all fields")
     }

     const existingUser = await USER_MODEL.findOne({
          $or: [{ username }, { email }]
     }).lean();

     if (existingUser) {
          return res.status(400).json({
               status: false,
               message: existingUser.username === username
                    ? "Username is already in use! Try another."
                    : "Email is already in use! Try another email."
          });
     }


     let temp_user = await USER_MODEL.create({
          username: username,
          slug: slugify(username),
          email,
          verifyedUser: false
     })

     await temp_user.save();

     logger.info(`${temp_user.username} registerd (not verified)`);


     const token = jwt.sign({
          user_id: temp_user._id,
          accountType: temp_user.accountType,
          username: temp_user.username,

     }, ENV.jwtSecret, { expiresIn: '15min' });

     temp_user.emailToken = token;
     await temp_user.save();

     let data = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Verify Your Account of info.pruthtek',
          html: `<h1>Verify Your Account of info.pruthtek</h1>
          <p>Hi ${username},</p>
          <p>Click the link below to verify your account:</p>
          <a href="http://localhost:3000/emailVerify/${token}">Verify Account</a>
          <p>Thanks,</p>
          <p>The info.pruthtek Team</p>`,
     });

     // country finding and saving in user is done later on
     // verify email by otp or link in email, then set passwrod 
     // work of sending link after whihc password can be setted

     res.status(200).json({ status: true, message: "Verification link is sent to email ! please check." });

}, "register");


export const googleCallback = async (req, res) => {

     const { token, user, accountType, authType } = req.user;

     if (authType === 'SignUp') {
          // for signUp
          res.redirect(`http://localhost:3000/accountDetails`);

     } else {
          // for login 
          res.redirect(`http://localhost:3000/succesFullLogin/${token}`);
     }

}


export const verfiy_token = asyncHandler(async (req, res) => {

     const { token } = req.body;
     if (!token) {
          throw new Error("Token not found")
     }
    
     // encode with jwt
     const decoded = jwt.decode(token, ENV.jwtSecret);
    

     // check user 
     let user = await USER_MODEL.findById(decoded.user_id);

     if (!user) {
          throw new Error("User not found")
     }
     if (user.refreshToken !== token) {
          throw new Error("Invalid token")
     }
     if (decoded.exp < (Math.floor(Date.now() / 1000))) {
          throw new Error("Token expired")
     }
     res.status(200).json({ message: "Token is valid", status: true, token, ...decoded });

}, 'verfiy_token')


export const EmailVerify = asyncHandler(async (req, res) => {

     const { token } = req.params;
     if (!token) {
          throw new Error("Token not found")
     }

     const decoded = jwt.verify(token, ENV.jwtSecret);
     
     // check user 
     let user = await USER_MODEL.findById(decoded.user_id);

     if (!user) {
          throw new Error("User not found")
     }
     if (token != user.emailToken) {
          throw new Error("Invalid token")
     }
     if (decoded.exp < (Math.floor(Date.now() / 1000))) {
          throw new Error("Token expired")
     }
     user.emailToken = null;
     user.verifyedUser = true;

     await user.save();

     res.status(200).json({ message: "Email verified", status: true });
     // create a achivement of first step complted

     let data = transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Account Verified Successfully of info.pruthtek',
          html: `<h1>Account Verified Successfully of info.pruthtek</h1>
          <p>Hi ${user?.username},</p>
          <p>Your account has been verified successfully.</p>
          <p>Thanks,</p>
          <p>The info.pruthtek Team</p>`,
     });

}, 'EmailVerify')



// checking required
export const logout = asyncHandler(async (req, res) => {

     const { token } = req.body;
     if (!token) {
          throw new Error("Token not found")
     }

     const decoded = jwt.decode(token, ENV.jwtSecret);
     // check user 
     let user = await USER_MODEL.findById(decoded.user_id);

     if (!user) {
          throw new Error("User not found")
     }
     if (user.refreshToken !== token) {
          throw new Error("Invalid token")
     }

     user.refreshToken = null;
     user.lastLogin = null;
     await user.save();

     res.status(200).json({ message: "Logout successful", status: true });

}, 'logout')
