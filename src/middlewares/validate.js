import createError from '../utils/createError.js';
export default (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    if (error.isJoi) {
      const JoiErrors = error.details.map((e) => e.message);
      next(createError(400, 'Validation error', JoiErrors));
    } else {
      console.log(error);
      next(createError(500, 'Internal server error'));
    }
  }
};
