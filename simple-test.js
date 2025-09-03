/**
 * SIMPLE TEST
 * ===========
 * Prueba mínima para verificar la creación de instancias
 */

console.log('Iniciando prueba simple...');

try {
    console.log('Importando QuantumOpportunityScanner...');
    const { QuantumOpportunityScanner } = require('./quantum-opportunity-scanner.js');
    console.log('Import exitoso');

    console.log('Creando instancia...');
    const scanner = new QuantumOpportunityScanner();
    console.log('Instancia creada exitosamente');

    console.log('Prueba completada');
} catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
}
