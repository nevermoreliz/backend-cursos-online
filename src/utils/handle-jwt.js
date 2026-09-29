const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
/**
 * Debe pasar el id de usuario para generar JWT
 * @param {*} id
 */
const tokenSign = (id) => {
    const payload = { id }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" })
}

/**
 * Pasar el token de sesion el JWT
 * @param {*} tokenJwt
 */
const verifyToken = (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, JWT_SECRET)
    } catch (error) {
        return null
    }
}

module.exports = { tokenSign, verifyToken }