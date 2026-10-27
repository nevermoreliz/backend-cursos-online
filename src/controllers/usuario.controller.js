const { matchedData } = require("express-validator");
const UsuarioAdmin = require("../models/usuario.model");
const { handleResponseJson, handleResponseJsonMsg } = require("../utils/handle-response-json");
const { handleHttpError } = require("../utils/handle-error");
const { encrypt } = require("../utils/handle-password");
const { paginateModel } = require("../utils/util-paginate");

const getUsuario = async (req, res) => {
    try {

        /**
         * obtener id del usuario
         */
        const { id } = req.params

        /**
         * buscar usuario por id
         */
        const usuario = await UsuarioAdmin.findByPk(id)

        /**
         * verificar si el usuario existe
         */
        if (!usuario) {
            return handleResponseJsonMsg(res, 404, 'Usuario no encontrado');
        }

        /**
         * eliminar la contraseña del usuario antes de enviar la respuesta
         */
        usuario.set({ password_hash: undefined });

        /**
         * enviar respuesta
         */
        handleResponseJson(res, 200, usuario, 'Usuario encontrado exitosamente');

    } catch (error) {
        console.error(`❌ [UsuarioAdminController - getUsuario] Error: ${error.message}`, error);
        handleHttpError(res, error, 'ERROR_OBTENER_USUARIO');
    }
};

const getUsuarios = async (req, res) => {
    try {

        /**
         * obtener usuarios con paginacion -> helper paginateModel
         */
        const { data: usuarios, paginacion } = await paginateModel(
            UsuarioAdmin, // modelo -> UsuarioAdmin
            req.query, // query params -> page, limit, search, sortBy, sortOrder
            ['nombre_completo', 'email'], // searchFields -> campos para buscar
            { attributes: { exclude: ['password_hash'] } } // options -> atributos a excluir
        );

        /**
         * enviar respuesta
         */
        handleResponseJson(res, 200, usuarios, 'Usuarios encontrados exitosamente', paginacion);

    } catch (error) {
        console.error(`❌ [UsuarioAdminController - getUsuarios] Error: ${error.message}`, error);
        handleHttpError(res, error, 'ERROR_OBTENER_USUARIOS');
    }
};

const createUsuarioAdmin = async (req, res) => {
    try {
        const dataClean = matchedData(req);
        const { nombre_completo, email, password, rol } = dataClean;

        /**
         * buscar si el usuario existe por email
         */
        const usuario = await UsuarioAdmin.findOne({ where: { email } })

        if (usuario) {
            return res.status(400).json({ error: 'El correo ya esta registrado' });
        }

        /**
         * encryptar contraseña
         */
        const passwordHash = await encrypt(password);

        /**
         * crear usuario
         */
        const data = { ...dataClean, password_hash: passwordHash }
        const newUsuario = await UsuarioAdmin.create(data);

        /**
         * eliminar la contraseña del usuario antes de enviar la respuesta
         */
        newUsuario.set({ password_hash: undefined });


        /**
         * enviar respuesta
         */
        handleResponseJson(res, 201, newUsuario, 'Usuario creado exitosamente');

    } catch (error) {

        console.error(`❌ [UsuarioAdminController - createUsuarioAdmin] Error: ${error.message}`, error);
        handleHttpError(res, error, 'ERROR_CREAR_USUARIO');
    }
};

const updateUsuarioAdmin = async (req, res) => {
    try {
        /**
         * obtener id del usuario a actualizar
         */
        const { id } = req.params;

        /**
         * obtener datos limpios
         */
        const dataClean = matchedData(req);
        const { nombre_completo, email, password, rol } = dataClean;

        /**
         * buscar usuario por id
         */
        const usuario = await UsuarioAdmin.findByPk(id)

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        /**
         * eliminar la contraseña antes de actualizar
         */
        delete dataClean.password;

        /**
         * actualizar usuario
         */
        const updateUsuario = await usuario.update(dataClean);

        /**
         * eliminar la contraseña del usuario antes de enviar la respuesta
         */
        updateUsuario.set({ password_hash: undefined });

        /**
         * enviar respuesta
         */
        handleResponseJson(res, 200, updateUsuario, 'Usuario actualizado exitosamente');

    } catch (error) {
        console.error(`❌ [UsuarioAdminController - updateUsuarioAdmin] Error: ${error.message}`, error);
        handleHttpError(res, error, 'ERROR_ACTUALIZAR_USUARIO');
    }
};

const deleteUsuarioAdmin = async (req, res) => {
    try {
        /**
         * obtener id del usuario a eliminar
         */
        const { id } = req.params;

        /**
         * buscar usuario por id
         */
        const usuario = await UsuarioAdmin.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        /**
         * eliminar usuario
         */
        await usuario.update({ activo: false });

        /**
         * enviar respuesta
         */
        handleResponseJson(res, 200, true, 'Usuario eliminado exitosamente');

    } catch (error) {
        console.error(`❌ [UsuarioAdminController - deleteUsuarioAdmin] Error: ${error.message}`, error);
        handleHttpError(res, error, 'ERROR_ELIMINAR_USUARIO');
    }
};

module.exports = { getUsuario, getUsuarios, createUsuarioAdmin, updateUsuarioAdmin, deleteUsuarioAdmin }