import rateLimit from "express-rate-limit";
import { logger } from '../config/logger.js'
import nodemailer from 'nodemailer'
import { FOLLOW_MODEL } from "../models/follower.js";

export const authLimiter = rateLimit({

     windowMs: 5 * 60 * 1000, // 10 minutes
     max: 15, // Allow only 5 requests per 10 minutes per IP

     handler: (req, res, next) => {
          logger.info(`Rate limit exceeded for IP:  ${req.ip}`);
          res.status(429).json({ message: "Too many requests, try later.", status: false });
     },
     headers: true, // Send rate limit headers
});



export function slugify(text) {
     return text
          .toString()                 // Convert to string (in case input is not a string)
          .toLowerCase()              // Convert to lowercase
          .normalize("NFD")           // Normalize characters (e.g., é → e)
          .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accents)
          .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
          .trim()                     // Trim spaces from start & end
          .replace(/\s+/g, "-")       // Replace spaces with hyphens
          .replace(/-+/g, "-");       // Remove multiple consecutive hyphens
}


// done 100%
export async function ApiAccessCheck(req, res, next) {

     try {
          if (req.headers['x-api-key'] !== process.env.API_ACCESS) {
               return res.status(401).json({ message: "Unauthorized", status: false });
          }
          next();
     } catch (error) {
          console.log("========== Error in ApiAccessCheck =================");
          console.error(error);
          logger.error(`[Mid] [ApiAccessCheck] ${error.message}`);
          return res.status(500).json({ message: "Internal Server Error", status: false });
     }
}


// done 10%
export async function isAuthenticated(req, res, next) {

     try {

          // check token and verify the token 


          next();
     } catch (error) {
          console.log("========== Error in isAuthenticated =================");
          console.error(error);
          logger.error(`[Mid] [isAuthenticated] ${error.message}`);
          return res.status(500).json({ message: "Internal Server Error", status: false });
     }
}



export function generateRandomNumber() {
     return Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
}




export const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
     },
});



export const countFollowers = async (userId) => {
     return await FOLLOW_MODEL.countDocuments({ following: userId });
};


export const countFollowing = async (userId) => {
     return await FOLLOW_MODEL.countDocuments({ follower: userId });
};
