import Joi from "joi";

export const UserDataSchema = Joi.object({
  email: Joi.string().required(),
  id: Joi.number().required(),
  name: Joi.string().required(),
  redisapikey: Joi.string().required(),
  disabled: Joi.boolean().required(),
  redis_url: Joi.string().required(),
}).meta({ className: "UserData" });

// ADD SCHEMAS HERE
export const TemplateSchema = Joi.object({}).meta({ className: "Template" });
