/**
 * SIMPLE EXPRESS TEST
 * ===================
 * Servicio Express mínimo para verificar funcionamiento
 */

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4608;

app.get('/test', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Simple Express test working',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Simple test server running on port ${PORT}`);
});

console.log('Simple Express test service starting...');
