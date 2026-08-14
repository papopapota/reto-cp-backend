
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    ENVIRONMENT: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    JWT_SECRET: string;
}

const envsSchema: joi.ObjectSchema<EnvVars> = joi.object({
    PORT: joi.number().required(),
    ENVIRONMENT: joi.string().valid('development', 'production', 'test').required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required()
})
    .unknown(true);

const { error, value } = envsSchema.validate(process.env)

if (error) {
    throw new Error(`Environment variables validation error: ${error.message}`);
};

const envsVars: EnvVars = value;

export const envs = {
    PORT: envsVars.PORT,
    ENVIRONMENT: envsVars.ENVIRONMENT,
    DATABASE_URL: envsVars.DATABASE_URL,
    JWT_SECRET: envsVars.JWT_SECRET,
}