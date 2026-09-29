const express = require('express')
const router = express.Router()
const { getUsuario, createUsuarioAdmin, updateUsuarioAdmin, deleteUsuarioAdmin } = require('../controllers/usuario.controller')
const { validarCrearUsuarioAdmin, validarUpdateUsuarioAdmin } = require('../validators/usuarios.validator');

/**
 * http://localhost:3000/api/usuario
 */
router.get('/listar/:id', getUsuario);
router.post('/crear', validarCrearUsuarioAdmin, createUsuarioAdmin)
router.put('/actualizar/:id', validarUpdateUsuarioAdmin, updateUsuarioAdmin)
router.delete('/eliminar/:id', deleteUsuarioAdmin)

module.exports = router