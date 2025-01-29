import { failedResponse } from '../utils/response.js';
import env from '../utils/env.js';
import { deleteFile } from '../helpers/googleDrive.js';
export default async (err, req, res, next) => {
  if (env.NODE_ENV === 'development') {
    console.error('Error message:', err.message);
  }
  if (req.googleImageId) {
    await deleteFile(req.googleImageId);
  }

  failedResponse(res, {
    code: err.code || 500,
    status: 'error',
    message: err.message || 'internal server error',
    stack: env.NODE_ENV === 'development' ? err.stack : {},
    details: err.details || null,
  });
};
