import Joi from 'joi';

export const createPets = Joi.object({
  name: Joi.string()
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
  age: Joi.number().integer().min(0).max(19).required().messages({
    'number.base': 'Age must be a number.',
    'number.integer': 'Age must be an integer.',
    'number.min': 'Age must be at least 0.',
    'number.max': 'Age must be at most 19.',
    'any.required': 'Age is required.',
  }),
  gender: Joi.string().valid('woman', 'man').required().messages({
    'any.only': 'Gender must be either "woman" or "man".',
    'any.required': 'Gender is required.',
  }),
});
