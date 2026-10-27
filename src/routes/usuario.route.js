const express = require('express')
const router = express.Router()
const { getUsuario, createUsuarioAdmin, updateUsuarioAdmin, deleteUsuarioAdmin, getUsuarios } = require('../controllers/usuario.controller')
const { validarCrearUsuarioAdmin, validarUpdateUsuarioAdmin } = require('../validators/usuarios.validator');

/**
 * http://localhost:3000/api/usuario
 */
router.get('/listar/:id', getUsuario);
router.get('/listar', getUsuarios);
router.post('/crear', validarCrearUsuarioAdmin, createUsuarioAdmin)
router.put('/actualizar/:id', validarUpdateUsuarioAdmin, updateUsuarioAdmin)
router.delete('/eliminar/:id', deleteUsuarioAdmin)

module.exports = router