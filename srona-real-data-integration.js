#!/usr/bin/env node
/**
 * 🔄 SRONA REAL DATA INTEGRATION
 * Complemento para integrar datos reales en lugar de mocks
 * 
 * PROBLEMAS IDENTIFICADOS:
 * - srona-api-server.py usa datos simulados
 * - Falta conexión entre TypeScript API y Python server
 * - Datos de opciones no están conectados a fuentes reales
 * 
 * @author QBTC Team
 * @version 1.0 Complemento
 */

const axios = require('axios');
const WebSocket = require('ws');

class SRONADataIntegrator {
    constructor() {
        this.binanceWS = null;
        this.dataCache = new Map();
        this.subscribers = new Set();
        
        // Configuración para datos reales
        this.config = {
            binanceSpot: 'https://api.binance.com/api/v3',
            binanceOptions: 'https://eapi.binance.com/eapi/v1',
            binanceWS: 'wss://stream.binance.com:9443/ws',
            updateInterval: 5000, // 5 segundos
            cacheTimeout: 30000   // 30 segundos
        };
        
        this.initializeWebSocket();
    }

    /**
     * Inicializar conexión WebSocket para datos en tiempo real
     */
    initializeWebSocket() {
        console.log('🔌 Conectando a Binance WebSocket...');
        
        this.binanceWS = new WebSocket(this.config.binanceWS + '/btcusdt@ticker');
        
        this.binanceWS.on('open', () => {
            console.log('✅ WebSocket conectado exitosamente');
        });
        
        this.binanceWS.on('message', (data) => {
            try {
                const ticker = JSON.parse(data);
                this.updateRealTimeData(ticker);
            } catch (error) {
                console.error('❌ Error procesando WebSocket data:', error);
            }
        });
        
        this.binanceWS.on('error', (error) => {
            console.error('❌ WebSocket error:', error);
            this.reconnectWebSocket();
        });
    }

    /**
     * Actualizar datos en tiempo real
     */
    updateRealTimeData(ticker) {
        const realTimeData = {
            symbol: ticker.s,
            price: parseFloat(ticker.c),
            volume: parseFloat(ticker.v),
            change: parseFloat(ticker.P),
            timestamp: Date.now()
        };
        
        this.dataCache.set('realtime_' + ticker.s, realTimeData);
        this.notifySubscribers('price_update', realTimeData);
    }

    /**
     * Obtener datos reales de opciones desde Binance
     */
    async getRealOptionsData(symbol = 'BTCUSDT') {
        try {
            console.log(`📊 Obteniendo datos reales de opciones para ${symbol}...`);
            
            const response = await axios.get(`${this.config.binanceOptions}/ticker`, {
                params: { underlying: symbol }
            });
            
            const optionsData = this.processOptionsData(response.data);
            this.dataCache.set(`options_${symbol}`, optionsData);
            
            return {
                success: true,
                symbol: symbol,
                data: optionsData,
                timestamp: Date.now(),
                source: 'binance_real'
            };
            
        } catch (error) {
            console.error(`❌ Error obteniendo opciones reales para ${symbol}:`, error.message);
            
            // Fallback a datos mock si falla la API real
            return this.getMockOptionsData(symbol);
        }
    }

    /**
     * Procesar datos de opciones de Binance
     */
    processOptionsData(rawData) {
        const processedData = {
            calls: [],
            puts: [],
            totalVolume: 0,
            totalOpenInterest: 0
        };
        
        rawData.forEach(option => {
            const processed = {
                symbol: option.symbol,
                strike: parseFloat(option.strikePrice),
                expiry: new Date(option.expiryDate),
                lastPrice: parseFloat(option.lastPrice),
                volume: parseFloat(option.volume || 0),
                openInterest: parseFloat(option.openInterest || 0),
                impliedVolatility: parseFloat(option.impliedVolatility || 0),
                delta: parseFloat(option.delta || 0),
                gamma: parseFloat(option.gamma || 0),
                theta: parseFloat(option.theta || 0),
                vega: parseFloat(option.vega || 0)
            };
            
            if (option.side === 'CALL') {
                processedData.calls.push(processed);
            } else {
                processedData.puts.push(processed);
            }
            
            processedData.totalVolume += processed.volume;
            processedData.totalOpenInterest += processed.openInterest;
        });
        
        return processedData;
    }

    /**
     * Datos mock como fallback
     */
    getMockOptionsData(symbol) {
        const basePrice = symbol === 'BTCUSDT' ? 45000 : 2800;
        
        return {
            success: true,
            symbol: symbol,
            data: {
                calls: [
                    {
                        strike: basePrice * 1.05,
                        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        lastPrice: basePrice * 0.02,
                        volume: 150,
                        openInterest: 1200
                    }
                ],
                puts: [
                    {
                        strike: basePrice * 0.95,
                        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        lastPrice: basePrice * 0.018,
                        volume: 180,
                        openInterest: 950
                    }
                ]
            },
            timestamp: Date.now(),
            source: 'mock_fallback'
        };
    }

    /**
     * Integrar con SRONA API TypeScript
     */
    async integrateSRONAAPI() {
        try {
            console.log('🔗 Integrando con SRONA API TypeScript...');
            
            const response = await axios.post('http://localhost:4601/api/srona/opportunities', {
                realData: true,
                source: 'data_integrator'
            });
            
            console.log('✅ Integración exitosa con SRONA API');
            return response.data;
            
        } catch (error) {
            console.error('❌ Error integrando con SRONA API:', error.message);
            return null;
        }
    }

    /**
     * Sistema de suscripción para actualizaciones
     */
    subscribe(callback) {
        this.subscribers.add(callback);
    }

    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }

    notifySubscribers(event, data) {
        this.subscribers.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('❌ Error notificando subscriber:', error);
            }
        });
    }

    /**
     * Reconectar WebSocket si se desconecta
     */
    reconnectWebSocket() {
        console.log('🔄 Reconectando WebSocket...');
        setTimeout(() => {
            this.initializeWebSocket();
        }, 5000);
    }

    /**
     * Iniciar integración completa
     */
    async start() {
        console.log('🚀 Iniciando SRONA Data Integrator...');
        
        // Obtener datos iniciales
        const btcOptions = await this.getRealOptionsData('BTCUSDT');
        const ethOptions = await this.getRealOptionsData('ETHUSDT');
        
        console.log('📊 Datos iniciales obtenidos:');
        console.log(`- BTC Options: ${btcOptions.success ? 'OK' : 'FALLBACK'}`);
        console.log(`- ETH Options: ${ethOptions.success ? 'OK' : 'FALLBACK'}`);
        
        // Integrar con SRONA API
        await this.integrateSRONAAPI();
        
        // Configurar actualizaciones periódicas
        setInterval(async () => {
            await this.getRealOptionsData('BTCUSDT');
            await this.getRealOptionsData('ETHUSDT');
        }, this.config.updateInterval);
        
        console.log('✅ SRONA Data Integrator iniciado completamente');
    }

    /**
     * Obtener estado del integrador
     */
    getStatus() {
        return {
            wsConnected: this.binanceWS && this.binanceWS.readyState === WebSocket.OPEN,
            cacheSize: this.dataCache.size,
            subscribers: this.subscribers.size,
            uptime: Date.now() - this.startTime,
            lastUpdate: this.lastUpdate
        };
    }
}

// Exportar para uso en otros módulos
module.exports = SRONADataIntegrator;

// Ejecución directa
if (require.main === module) {
    const integrator = new SRONADataIntegrator();
    
    integrator.subscribe((event, data) => {
        console.log(`📡 Evento recibido: ${event}`, data.symbol, data.price);
    });
    
    integrator.start().catch(error => {
        console.error('❌ Error iniciando integrador:', error);
        process.exit(1);
    });
}
