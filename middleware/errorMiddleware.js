// Middleware for handling 404 "Not Found" errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware for centralized error handling
const errorHandler = (err, req, res, next) => {
  // If status code hasn’t already been set (like 401/403 in auth middleware)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error('Error Middleware Caught:', err.message);

  res.json({
    message: err.message,
    // Show stack only in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };