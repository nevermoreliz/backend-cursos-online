// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: process.env.DB_LOGGING === 'true' ? console.log : false,
        pool: {
            max: 15,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        dialectOptions: isProduction
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false, // Útil para despliegues en la nube (Render, Supabase, Neon, etc.)
                },
            }
            : {},
        define: {
            timestamps: true,
            underscored: true, // Convierte camelCase de JS a snake_case en PostgreSQL (ej. createdAt -> created_at)
        },
    }
);

module.exports = sequelize;