/**
 * SECTOR SCANNER TEST
 * ===================
 * Prueba específica para SectorAwareQuantumScanner
 */

console.log('Iniciando prueba del SectorAwareQuantumScanner...');

try {
    console.log('Importando SectorAwareQuantumScanner...');
    const { SectorAwareQuantumScanner } = require('./sector-aware-quantum-scanner.js');
    console.log('Import exitoso');

    console.log('Creando instancia...');
    const scanner = new SectorAwareQuantumScanner();
    console.log('Instancia creada exitosamente');

    console.log('Verificando propiedades...');
    console.log('sectorDefinitions:', typeof scanner.sectorDefinitions);
    console.log('sectorGravitationalForces:', typeof scanner.sectorGravitationalForces);

    console.log('Prueba completada exitosamente');
} catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
}
