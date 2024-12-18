export default (code, message, details) => {
  const error = new Error(message || 'internal server error');
  error.code = code;
  error.details = details ? details : null;
  return error;
};
