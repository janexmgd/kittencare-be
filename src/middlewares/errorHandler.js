import { failedResponse } from '../utils/response.js';
import env from '../utils/env.js';
export default (err, req, res, next) => {
  if (env.NODE_ENV === 'development') {
    console.error('Error message:', err.message);
  }

  failedResponse(res, {
    code: err.code || 500,
    status: 'error',
    message: err.message || 'internal server error',
    stack: env.NODE_ENV === 'development' ? err.stack : {},
    details: err.details || null,
  });
};
