const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const UsuarioAdmin = sequelize.define('usuarios_admin',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_completo: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true // Validación extra recomendada para emails
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        rol: {
            type: DataTypes.ENUM('SUPERADMIN', 'ADMIN', 'OPERADOR'),
            allowNull: false,
            defaultValue: 'OPERADOR'
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: 'usuarios_admin',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: 'actualizado_en',
        schema: 'public'
    });

module.exports = UsuarioAdmin