// src/server.js
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // 1. Probar autenticación con la base de datos
        await sequelize.authenticate();
        console.log('📌 Conexión con PostgreSQL establecida exitosamente mediante Sequelize.');

        // 2. Levantar servidor Express
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
            console.log(`📌 Modo: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos PostgreSQL:', error.message);
        process.exit(1);
    }
}

startServer();