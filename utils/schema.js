const Joi = require('@hapi/joi');
const JoiGuidV4 = Joi.string().guid({version: ['uuidv4']});

const schema = (() => {
  return {
    signUpSchema: Joi.object()
      .keys({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
      })
      .unknown(false),

    signInSchema: Joi.object()
      .keys({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      })
      .unknown(false),

    changePasswordSchema: Joi.object()
      .keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
      })
      .unknown(false)
  };
})();

module.exports = {schema};