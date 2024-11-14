import Joi from 'joi';

export const loginSchema = Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }).error(new Error('Invalid email')),
    password: Joi.string().required().min(8),
});

export const resetCodeRequestSchema = Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }).error(new Error('Invalid email')),
    captchaToken: Joi.string().required(),
});

export const resetPasswordRequestSchema = Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }).error(new Error('Invalid email')),
    password: Joi.string()
        .pattern(new RegExp('^(?=.{8,}$)(?=.*[A-Za-z])(?=.*[0-9]).*'))
        .required()
        .error(new Error('Password must be minimum of 8 characters with at least 1 alphabet and 1 number')),
    verificationCode: Joi.string().required(),
});
