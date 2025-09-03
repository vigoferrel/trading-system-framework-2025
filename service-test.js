/**
 * SERVICE TEST
 * ============
 * Prueba del servicio sectorial
 */

const express = require('express');
const cors = require('cors');

console.log('Iniciando prueba del servicio...');

try {
    const app = express();
    app.use(cors());
    app.use(express.json());

    const PORT = 4605;

    app.get('/health', (req, res) => {
        res.json({
            status: 'active',
            service: 'Test Service',
            timestamp: new Date().toISOString()
        });
    });

    app.listen(PORT, () => {
        console.log(`Test service running on port ${PORT}`);
    });

    console.log('Servicio de prueba creado exitosamente');
} catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
}
