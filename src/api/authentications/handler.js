const ClientError = require('../../exceptions/ClientError');

class AuthenticationsHandler {
    constructor (authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationsHandler = this.postAuthenticationsHandler.bind(this);
        this.putAuthenticationsHandler = this.putAuthenticationsHandler.bind(this);
        this.deleteAuthenticationsHandler = this.deleteAuthenticationsHandler.bind(this);
    }

    async postAuthenticationsHandler (request, h) {
        try {
            this._validator.validatePostAuthenticationsPayload(request.payload);

            const { username, password } = request.payload;
            const id = await this._usersService.verifyUserCredential(username, password);
            const accessToken = this._tokenManager.generateAccessToken({ id });
            const refreshToken = this._tokenManager.generateRefreshToken({ id });

            this._authenticationsService.addRefreshToken(refreshToken);
            const response = h.response({
                status: 'success',
                message: 'Authentication berhasil ditambahkan',
                data: {
                    accessToken,
                    refreshToken
                }
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.code);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async putAuthenticationsHandler (request, h) {
        try {
            this._validator.validatePutAuthenticationsPayload(request.payload);

            const { refreshToken } = request.payload;
            await this._authenticationsService.verifyRefreshToken(refreshToken);
            const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

            const accessToken = this._tokenManager.generateAccessToken({ id });
            return {
                status: 'success',
                message: 'Access Token berhasil diperbarui',
                data: {
                    accessToken
                }
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.code);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteAuthenticationsHandler (request, h) {
        try {
            await this._validator.validateDeleteAuthenticationsPayload(request.payload);

            const { refreshToken } = request.payload;
            await this._authenticationsService.verifyRefreshToken(refreshToken);
            await this._authenticationsService.deleteRefreshToken(refreshToken);
            return {
                status: 'success',
                message: 'Refresh token berhasil dihapus'
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.code);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = AuthenticationsHandler;
