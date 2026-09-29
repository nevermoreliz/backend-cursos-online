const { handleResponseJsonMsg, handleResponseJson } = require("../utils/handle-response-json");
const { handleHttpError } = require("../utils/handle-error");
const { compare } = require("../utils/handle-password");
const { tokenSign, verifyToken } = require("../utils/handle-jwt");
const UsuarioAdmin = require("../models/usuario.model");

const login = async (req, res) => {

    try {
        const { email, password } = req.body

        /**
         * buscar usuario por email
         */

        const usuario = await UsuarioAdmin.findOne({ where: { email } })

        if (!usuario) {
            return handleResponseJsonMsg(res, 404, 'Usuario no encontrado');
        }

        /**
         * validar contraseña
         */
        const validPassword = compare(password, usuario.password_hash)

        if (!validPassword) {
            return handleResponseJsonMsg(res, 401, 'Contraseña incorrecta');
        }

        /**
         * generar token
         */
        const token = tokenSign(usuario.id)

        /**
         * eliminar la contraseña del usuario antes de enviar la respuesta
         */
        usuario.set({ password_hash: undefined });

        /**
         * enviar respuesta
         */
        handleResponseJson(res, 200, { usuario, token }, 'Usuario logueado exitosamente');


    } catch (error) {
        console.error(`❌ [AuthController - login] Error: ${error.message}`, error);
        handleHttpError(res, error, 'ERROR_LOGIN');
    }

}

/**
 * Verifica el token JWT y devuelve los datos del usuario con un token renovado.
 * El frontend lo usa al recargar la página para comprobar si la sesión sigue activa.
 */
const verificarToken = async (req, res) => {

    try {
        const authorization = req.headers.authorization

        if (!authorization) {
            return handleResponseJsonMsg(res, 401, 'Token no proporcionado');
        }

        /**
         * Extraer el token del header "Bearer <token>"
         */
        const token = authorization.split(' ').pop()
        const dataToken = verifyToken(token)

        if (!dataToken || !dataToken.id) {
            return handleResponseJsonMsg(res, 401, 'Token inválido o expirado');
        }

        /**
         * Buscar el usuario por el id del token
         */
        const usuario = await UsuarioAdmin.findByPk(dataToken.id)

        if (!usuario) {
            return handleResponseJsonMsg(res, 404, 'Usuario no encontrado');
        }

        /**
         * Generar un nuevo token (renovar sesión)
         */
        const newToken = tokenSign(usuario.id)

        /**
         * Eliminar la contraseña antes de enviar la respuesta
         */
        usuario.set({ password_hash: undefined });

        handleResponseJson(res, 200, { usuario, token: newToken }, 'Token válido');

    } catch (error) {
        console.error(`❌ [AuthController - verificarToken] Error: ${error.message}`, error);
        handleHttpError(res, error, 'ERROR_VERIFICAR_TOKEN');
    }

}

module.exports = { login, verificarToken }