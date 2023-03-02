const {
    PostAuthenticationPayloadSchema,
    PutAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationValidator = {
    validatePostAuthenticationsPayload: (payload) => {
        const validationResult = PostAuthenticationPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePutAuthenticationsPayload: (payload) => {
        const validationResult = PutAuthenticationPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateDeleteAuthenticationsPayload: (payload) => {
        const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
};

module.exports = AuthenticationValidator;
