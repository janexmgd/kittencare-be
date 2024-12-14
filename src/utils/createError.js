export default (code, message, details) => {
  const error = new Error(message);
  error.code = code;
  error.details = details ? details : null;
  return error;
};
