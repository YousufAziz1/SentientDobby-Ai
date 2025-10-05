function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error('Error:', message, err.stack);
  }
  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
