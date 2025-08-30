/**
 * [TEST] TEST INTEGRACIÓN COMPLETA - NÚCLEO PSICOLÓGICO
 * ================================================
 * 
 * Script de prueba para la integración completa del núcleo psicológico
 * con tasas de cambio de patrones fundamentales
 */

const { IntegracionNucleoPsicologico } = require('./integracion-nucleo-psicologico.js');

async function testIntegracionCompleta() {
    console.log('[TEST] [TEST INTEGRACIÓN COMPLETA] Iniciando prueba del núcleo psicológico...');
    
    try {
        // [START] INICIALIZAR INTEGRACIÓN
        const integracion = new IntegracionNucleoPsicologico();
        
        //  ESPERAR INICIALIZACIÓN
        console.log(' Esperando inicialización del sistema...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // [DATA] MOSTRAR ESTADO INICIAL
        console.log('\n[DATA] [TEST] Estado inicial del sistema:');
        const estadoInicial = integracion.obtenerEstadoGlobal();
        console.log('[OK] Última actualización:', estadoInicial.ultimaActualizacion || 'N/A');
        console.log(' Estado psicológico:', estadoInicial.estadoPsicologicoActual?.estado_global?.emocion || 'N/A');
        console.log('[ENDPOINTS] Oportunidades detectadas:', estadoInicial.oportunidadesDetectadas?.length || 0);
        console.log('[ALERT] Alertas activas:', estadoInicial.alertasPsicologicas?.length || 0);
        
        // [RELOAD] EJECUTAR CICLO DE MONITOREO MANUAL
        console.log('\n[RELOAD] [TEST] Ejecutando ciclo de monitoreo manual...');
        await integracion.ejecutarCicloMonitoreo();
        
        // [DATA] MOSTRAR RESULTADOS
        console.log('\n[DATA] [TEST] Resultados del monitoreo:');
        const estadoFinal = integracion.obtenerEstadoGlobal();
        
        if (estadoFinal.estadoPsicologicoActual) {
            const { estado_global, estados_individuales } = estadoFinal.estadoPsicologicoActual;
            
            console.log('\n [TEST] Estado psicológico global:');
            console.log('[DATA] Emoción dominante:', estado_global.emocion);
            console.log('[DATA] Puntuación promedio:', estado_global.puntuacion?.toFixed(3) || 'N/A');
            console.log('[DATA] Coherencia promedio:', estado_global.coherencia?.toFixed(3) || 'N/A');
            console.log('[DATA] Confianza promedio:', estado_global.confianza?.toFixed(3) || 'N/A');
            console.log('[DATA] Energía promedio:', estado_global.energia?.toFixed(3) || 'N/A');
            console.log('[DATA] Total símbolos analizados:', estado_global.total_simbolos || 0);
            
            // [UP] MOSTRAR ESTADOS INDIVIDUALES DE SÍMBOLOS PRINCIPALES
            console.log('\n[UP] [TEST] Estados psicológicos individuales (símbolos principales):');
            const simbolosPrincipales = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
            
            for (const symbol of simbolosPrincipales) {
                const estadoIndividual = estados_individuales.find(e => e.symbol === symbol);
                if (estadoIndividual) {
                    const { estado_psicologico, tasas_cambio, quantum_enhanced } = estadoIndividual.estado;
                    console.log(`[MONEY] ${symbol}:`);
                    console.log(`    Estado: ${estado_psicologico.emocion} (${estado_psicologico.puntuacion.toFixed(3)})`);
                    console.log(`   [DATA] Tasas cambio: ${tasas_cambio.puntuacion_global.toFixed(3)}`);
                    console.log(`    Quantum enhancement: ${quantum_enhanced.quantum_enhancement.toFixed(3)}`);
                    
                    // [UP] MOSTRAR TASAS DE CAMBIO DETALLADAS
                    if (tasas_cambio.precio) {
                        console.log(`   [MONEY] Precio - Cambio: ${tasas_cambio.precio.cambio_porcentual.toFixed(3)}`);
                        console.log(`   [MONEY] Precio - Aceleración: ${tasas_cambio.precio.aceleracion.toFixed(3)}`);
                        console.log(`   [MONEY] Precio - Momentum: ${tasas_cambio.precio.momentum.toFixed(3)}`);
                    }
                    
                    if (tasas_cambio.volumen) {
                        console.log(`   [DATA] Volumen - Cambio: ${tasas_cambio.volumen.cambio_porcentual.toFixed(3)}`);
                        console.log(`   [DATA] Volumen - Ratio 24h: ${tasas_cambio.volumen.ratio_24h.toFixed(3)}`);
                        console.log(`   [DATA] Volumen - Intensidad: ${tasas_cambio.volumen.intensidad.toFixed(3)}`);
                    }
                    
                    if (tasas_cambio.funding) {
                        console.log(`    Funding - Tasa: ${tasas_cambio.funding.tasa_actual.toFixed(4)}`);
                        console.log(`    Funding - Cambio: ${tasas_cambio.funding.cambio_porcentual.toFixed(3)}`);
                        console.log(`    Funding - Presión: ${tasas_cambio.funding.presion}`);
                    }
                    
                    if (tasas_cambio.volatilidad) {
                        console.log(`   [UP] Volatilidad - Nivel: ${tasas_cambio.volatilidad.nivel_actual.toFixed(3)}`);
                        console.log(`   [UP] Volatilidad - Riesgo: ${tasas_cambio.volatilidad.riesgo.toFixed(3)}`);
                        console.log(`   [UP] Volatilidad - Spike: ${tasas_cambio.volatilidad.spike ? 'SÍ' : 'NO'}`);
                    }
                } else {
                    console.log(`[MONEY] ${symbol}: No disponible`);
                }
            }
        }
        
        // [ENDPOINTS] MOSTRAR OPORTUNIDADES DETECTADAS
        console.log('\n[ENDPOINTS] [TEST] Oportunidades detectadas:');
        const oportunidades = integracion.obtenerOportunidades();
        
        if (oportunidades.length > 0) {
            oportunidades.forEach((oportunidad, index) => {
                console.log(`\n${index + 1}. ${oportunidad.symbol}:`);
                console.log(`   [ENDPOINTS] Tipo: ${oportunidad.tipo}`);
                console.log(`    Estado psicológico: ${oportunidad.estado_psicologico}`);
                console.log(`   [DATA] Score: ${oportunidad.score.toFixed(3)}`);
                console.log(`   [DATA] Puntuación psicológica: ${oportunidad.puntuacion_psicologica.toFixed(3)}`);
                console.log(`   [DATA] Tasas de cambio: ${oportunidad.tasas_cambio.toFixed(3)}`);
                console.log(`    Quantum enhancement: ${oportunidad.quantum_enhancement.toFixed(3)}`);
            });
        } else {
            console.log('[ERROR] No se detectaron oportunidades');
        }
        
        // [ALERT] MOSTRAR ALERTAS ACTIVAS
        console.log('\n[ALERT] [TEST] Alertas activas:');
        const alertas = integracion.obtenerAlertas();
        
        if (alertas.length > 0) {
            alertas.forEach((alerta, index) => {
                console.log(`\n${index + 1}. ${alerta.tipo} (${alerta.severidad}):`);
                console.log(`    ${alerta.mensaje}`);
                if (alerta.simbolo) {
                    console.log(`   [MONEY] Símbolo: ${alerta.simbolo}`);
                }
                console.log(`   [TIME] ${alerta.timestamp}`);
            });
        } else {
            console.log('[OK] No hay alertas activas');
        }
        
        // [DATA] MOSTRAR MÉTRICAS GLOBALES
        console.log('\n[DATA] [TEST] Métricas globales:');
        const metricas = estadoFinal.metricasGlobales;
        
        if (metricas) {
            console.log('[DATA] Total símbolos analizados:', metricas.total_simbolos_analizados || 0);
            console.log('[DATA] Estado psicológico promedio:', metricas.estado_psicologico_promedio?.toFixed(3) || 'N/A');
            console.log('[DATA] Emoción dominante:', metricas.emocion_dominante || 'N/A');
            console.log('[DATA] Oportunidades detectadas:', metricas.oportunidades_detectadas || 0);
            console.log('[DATA] Alertas activas:', metricas.alertas_activas || 0);
        }
        
        // [ENDPOINTS] EVALUAR RESULTADO FINAL
        console.log('\n[ENDPOINTS] [TEST] Evaluación del resultado:');
        
        if (estadoFinal.estadoPsicologicoActual?.estado_global) {
            const puntuacion = estadoFinal.estadoPsicologicoActual.estado_global.puntuacion;
            const oportunidades = estadoFinal.oportunidadesDetectadas.length;
            const alertas = estadoFinal.alertasPsicologicas.length;
            
            if (puntuacion > 0.7) {
                console.log('[OK] EXCELENTE - Estado psicológico muy favorable');
            } else if (puntuacion > 0.5) {
                console.log('[YELLOW] BUENO - Estado psicológico moderado');
            } else {
                console.log('[RED] BAJO - Estado psicológico desfavorable');
            }
            
            if (oportunidades > 0) {
                console.log(`[OK] OPORTUNIDADES - ${oportunidades} oportunidades detectadas`);
            } else {
                console.log('[WARNING] SIN OPORTUNIDADES - No se detectaron oportunidades');
            }
            
            if (alertas > 0) {
                console.log(`[ALERT] ALERTAS - ${alertas} alertas activas`);
            } else {
                console.log('[OK] SIN ALERTAS - Sistema estable');
            }
        }
        
        console.log('\n [TEST INTEGRACIÓN COMPLETA] Prueba completada exitosamente!');
        
        // [RELOAD] CONTINUAR MONITOREO POR 30 SEGUNDOS
        console.log('\n[RELOAD] [TEST] Continuando monitoreo por 30 segundos...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // [DATA] MOSTRAR ESTADO FINAL
        console.log('\n[DATA] [TEST] Estado final después de 30 segundos:');
        const estadoFinal30s = integracion.obtenerEstadoGlobal();
        console.log('[OK] Última actualización:', estadoFinal30s.ultimaActualizacion || 'N/A');
        console.log(' Estado psicológico:', estadoFinal30s.estadoPsicologicoActual?.estado_global?.emocion || 'N/A');
        console.log('[ENDPOINTS] Oportunidades detectadas:', estadoFinal30s.oportunidadesDetectadas?.length || 0);
        console.log('[ALERT] Alertas activas:', estadoFinal30s.alertasPsicologicas?.length || 0);
        
        console.log('\n [TEST INTEGRACIÓN COMPLETA] Prueba finalizada exitosamente!');
        
    } catch (error) {
        console.error('[ERROR] [TEST INTEGRACIÓN COMPLETA] Error durante la prueba:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// [START] EJECUTAR PRUEBA
testIntegracionCompleta();
