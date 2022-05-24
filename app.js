const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Routers
const { usersRouter } = require('./routers/users.routes');
const { repairsRouter } = require('./routers/repairs.routes');

const { globalErrorHandler } = require('./controllers/error.controller');

const app = express();

// Enable CORS
app.use(cors());

// Enable incoming JSON data
app.use(express.json());

//Add security helmet
app.use(helmet());

// Compress responses
app.use(compression());

// Log incoming requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Limit IP requests
const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 60 * 1000, // 1 hr
  message: 'Too many requests from this IP',
});

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/repairs', repairsRouter);

// Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };
