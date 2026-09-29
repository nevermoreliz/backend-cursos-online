const express = require('express');
const router = express.Router()
const { login, verificarToken } = require('../controllers/auth.controller');


router.post("/iniciar-sesion", login);
router.get("/verificar-token", verificarToken);

module.exports = router