import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from './config/passport.js';
import { ENV } from './config/env.js';
import { logger } from './config/logger.js';
import connectDB from './db/db.js';
import { errorHandler } from './middelwars/error.middelware.js';
import connectGraphql from './db/graphql.js'
import { AuthRouter } from './routes/auth.route.js';
import { BlogRouter } from './routes/blog.route.js';
import { expressMiddleware } from '@apollo/server/express4';
import { TestRouter } from './routes/test.route.js';
import { UserRouter } from './routes/user.route.js';
// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

// Connect Database
connectDB();

// Routes
app.use('/v1/auth', AuthRouter);
app.use('/v1/blog', BlogRouter);
app.use('/v1/test', TestRouter);
app.use('/v1/user', UserRouter);


// Test Route
app.get('/', (req, res) => {
     res.json({ status: true, message: 'Server is running' });
});

// Error Handling Middleware
app.use(errorHandler);


// Connect GraphQL
let server = await connectGraphql();
app.use('/graphql', expressMiddleware(server));


// Start Server
app.listen(ENV.port, () => {
     logger.info(`[Glb] Server running at http://localhost:${ENV.port}`);
});

// Handle Uncaught Errors
process.on('uncaughtException', (err) => {
     logger.error('[Glb] Uncaught Exception:', err);
     process.exit(1);
});

process.on('unhandledRejection', (err) => {
     logger.error('[Glb] Unhandled Promise Rejection:', err);
     process.exit(1);
});
