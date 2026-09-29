const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middlewares globales de seguridad y logs
app.use(helmet({ crossOriginResourcePolicy: false })); // Permite servir imágenes/comprobantes
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta de comprobantes y plantillas (de forma controlada)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta de comprobación de salud del servicio (Health Check)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware para manejo de rutas no encontradas (404)
// app.use((req, res, next) => {
//     res.status(404).json({ error: 'Ruta no encontrada' });
// });

// Cargar rutas dinámicas desde ./routes
app.use("/api", require("./routes"))


// Middleware global de manejo de errores
app.use((err, req, res, next) => {
    console.error(`❌ [App - error] Error: ${err.message}`, err);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
    });
});

module.exports = app;