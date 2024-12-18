import Joi from 'joi';

export const registerSchema = Joi.object({
  fullName: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'Name must be alphabet only.',
      'string.min': 'Name must have at least 3 characters.',
      'string.max': 'The maximum name length is 50 characters.',
      'any.required': 'Name is required.',
    }),
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_]{3,30}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Username must be 3-30 characters long and can only contain alphanumeric characters or underscores.',
      'string.empty': `Username can't be empty.`,
      'any.required': 'Username is required.',
    }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must have at least 8 characters.',
    'any.required': 'Password is required.',
  }),
  confirmPassword: Joi.string().min(8).required().messages({
    'string.min': 'Confirm Password must have at least 8 characters.',
    'any.required': 'Confirm Password is required.',
  }),
  dob: Joi.date().required().messages({
    'any.required': 'Date of birth is required.',
  }),
  gender: Joi.string().required().messages({
    'any.required': 'Gender is required.',
  }),
  job: Joi.string().required().messages({
    'any.required': 'Job is required.',
  }),
});
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must have at least 8 characters.',
    'any.required': 'Password is required.',
  }),
});
