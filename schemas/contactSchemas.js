import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.empty": `"name" cannot be empty`,
    "any.required": `"name" is required`,
  }),
  email: Joi.string().email().required().messages({
    "string.email": `"email" must be a valid email`,
    "any.required": `"email" is required`,
  }),
  phone: Joi.string().min(5).required().messages({
    "string.empty": `"phone" cannot be empty`,
    "any.required": `"phone" is required`,
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string().min(5),
})
  .min(1)
  .messages({
    "object.min": "Body must have at least one field",
  });
