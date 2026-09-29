const { check, body } = require('express-validator');
const validateResult = require('../utils/handle-validator')

// const validatorUsuario = [
//     check('id_persona', 'id persona es obligatorio').exists().notEmpty().isNumeric().withMessage('el id persona debe ser numerico'),
//     check('nombre_usuario', 'el nombre de usuario es obligatorio').exists().notEmpty().withMessage('el nombre de usuario es obligatorio'),
//     check('contrasenia_hash', 'la contraseña es obligatorio').exists().notEmpty().isLength({ min: 3, max: 15 }).withMessage('la contraseña debe tener entre 3 y 15 caracteres'),
//     check('activo').optional().isBoolean().withMessage('el activo debe ser booleano'),
//     (req, res, next) => { return validateResult(req, res, next) }
// ]

const getUsuarioAdminValidacion = (isEdit = false) => {

    // Función ayudante: Obligatorio en creación, Opcional (pero validado si se envía) en edición
    const campoBase = (campo) => {
        const validador = body(campo);
        if (isEdit) {
            validador.optional();
        } else {
            validador.notEmpty().withMessage(`El campo ${campo} es obligatorio`);
        }
        return validador;
    };

    return [
        // ==========================================
        // 1. CAMPOS OBLIGATORIOS (Opcionales en Edición)
        // ==========================================
        campoBase('nombre_completo')
            .isString().withMessage('El nombre debe ser un texto')
            .isLength({ min: 3, max: 120 }).withMessage('El nombre debe tener entre 3 y 120 caracteres'),

        campoBase('email')
            .isEmail().withMessage('El formato de correo no es válido')
            .isLength({ max: 150 }).withMessage('El correo no puede superar los 150 caracteres')
            .normalizeEmail(), // Sanitización: convierte a minúsculas y quita espacios extra

        // Nota: Validamos 'password' (lo que envía el cliente), en tu controlador lo convertirás a 'password_hash'
        campoBase('password')
            .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),

        // ==========================================
        // 2. CAMPOS SIEMPRE OPCIONALES (Tienen Default en DB)
        // ==========================================
        body('rol')
            .optional({ nullable: true })
            .toUpperCase() // Sanitización: Asegura que siempre llegue en mayúsculas
            .isIn(['SUPERADMIN', 'ADMIN', 'OPERADOR'])
            .withMessage('El rol debe ser: SUPERADMIN, ADMIN u OPERADOR'),

        body('activo')
            .optional({ nullable: true })
            .isBoolean().withMessage('El campo activo debe ser un valor booleano (true o false)')
            .toBoolean(), // Convierte "true" (string) a true (booleano)

        // ==========================================
        // 3. Middleware de resultados
        // ==========================================
        validateResult
    ];
};


module.exports = {
    validarCrearUsuarioAdmin: getUsuarioAdminValidacion(false),
    validarUpdateUsuarioAdmin: getUsuarioAdminValidacion(true)
};