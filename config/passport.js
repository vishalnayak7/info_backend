import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ENV } from './env.js';
import { USER_MODEL } from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from './logger.js'
passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.googleClientID,
      clientSecret: ENV.googleClientSecret,
      callbackURL: '/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        
        let user = await USER_MODEL.findOne({ email: profile.emails[0].value }).select(' accountType username avatar  country refreshToken lastLogin lastPasswordChange');

        if (user) {
          // for login 

          const token = jwt.sign({ user_id: user._id, accountType: user.accountType, avatar: user.avatar, username: user.username }, ENV.jwtSecret, { expiresIn: '1d' });

          user.refreshToken = token;
          user.lastLogin = new Date();

          await user.save()
          logger.info(`${user.username} logged in`);
          return done(null, { token,  user, accountType: user.accountType, authType: 'Login' });

        } else {
          // for register 

          let create_user = await USER_MODEL.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            password: await bcrypt.hash(profile.id, 10),
            accountType: "Simple"
          });

          await create_user.save();

          const token = jwt.sign({user_id: create_user._id, accountType: create_user.accountType, avatar: create_user.avatar, username: create_user.username }, ENV.jwtSecret, { expiresIn: '1d' });

          create_user.refreshToken = token;
          create_user.lastLogin = new Date();

          await create_user.save();
          logger.info(`${user?.username} Is registered`);
          return done(null, { token, user: create_user, accountType: create_user.accountType, authType: 'SignUp' });

        }
      } catch (error) {
        logger.error(`Error at google auth middleware ${error.message}`);
        return done(error, null);
      }
    }
  )
);

export default passport;
