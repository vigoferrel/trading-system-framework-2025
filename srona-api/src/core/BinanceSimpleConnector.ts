import { NakedOpportunity } from '../types/srona-core-types';
import * as crypto from 'crypto';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Cargar variables de entorno al inicio del módulo
dotenv.config();

export class BinanceSimpleConnector {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly spotClient: any;
  private readonly optionsClient: any;

  constructor() {
    this.apiKey = process.env.BINANCE_API_KEY || '';
    this.apiSecret = process.env.BINANCE_API_SECRET || '';

    if (!this.apiKey || !this.apiSecret) {
      console.warn('ADVERTENCIA: Las claves API de Binance no están configuradas en el archivo .env. El conector no funcionará.');
    }

    this.spotClient = axios.create({
      baseURL: process.env.BINANCE_SPOT_BASE_URL || 'https://api.binance.com/api/v3'
    });

    this.optionsClient = axios.create({
      baseURL: process.env.BINANCE_OPTIONS_BASE_URL || 'https://eapi.binance.com/eapi/v1'
    });

    // Interceptor para añadir la firma a las peticiones de opciones
    this.optionsClient.interceptors.request.use((config: any) => {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('Las claves de API no están configuradas para firmar la solicitud.');
      }
      
      if (!config.params) {
        config.params = {};
      }
      config.headers['X-MBX-APIKEY'] = this.apiKey;
      const timestamp = Date.now();
      const params = { ...config.params, timestamp };
      const queryString = new URLSearchParams(params).toString();
      const signature = crypto.createHmac('sha256', this.apiSecret).update(queryString).digest('hex');
      config.params = { ...params, signature };
      return config;
    });
  }

  /**
   * Obtiene los datos de frecuencia de las opciones desde la API de Binance.
   */
  public async getFrequencyData(): Promise<NakedOpportunity[]> {
    try {
      console.log('[BinanceSimpleConnector] Obteniendo datos de opciones para BTCUSDT...');
      const response = await this.optionsClient.get('/ticker', {
        params: { underlying: 'BTCUSDT' }
      });
      const opportunities = this.mapApiResponseToNakedOpportunities(response.data);
      console.log(`[BinanceSimpleConnector] Se encontraron ${opportunities.length} oportunidades de opciones.`);
      return opportunities;
    } catch (error: any) {
      if (error.response) {
        console.error('Error de Axios al obtener datos de opciones de Binance:', error.response?.data || error.message);
      } else {
        console.error('Error inesperado al obtener datos de opciones de Binance:', error.message);
      }
      return [];
    }
  }

  private mapApiResponseToNakedOpportunities(apiResponse: any[]): NakedOpportunity[] {
    return apiResponse.map((item): NakedOpportunity => {
      const strike = parseFloat(item.strikePrice);
      const spotPrice = parseFloat(item.underlyingPrice); // Asumiendo que la API lo provee
      const premium = parseFloat(item.lastPrice);
      const isCall = item.side === 'CALL';
      const expiry = new Date(item.expiryDate).getTime();

      return {
        id: item.symbol,
        symbol: item.symbol.split('-')[0], // ej. BTCUSDT-241227-80000-C -> BTCUSDT
        type: isCall ? 'NAKED_CALL' : 'NAKED_PUT',
        strike: strike,
        expiry: expiry,
        spotPrice: spotPrice,
        premium: premium,
        impliedVolatility: parseFloat(item.impliedVolatility),
        delta: parseFloat(item.delta),
        gamma: parseFloat(item.gamma),
        theta: parseFloat(item.theta),
        vega: parseFloat(item.vega),
        volume24h: parseFloat(item.volume),
        openInterest: parseFloat(item.openInterest),
        nakedScore: 0, // Se calculará después
        liquidityScore: 0, // Se calculará después
        riskRewardRatio: 0, // Se calculará después
        probabilityOfProfit: 0, // Se calculará después
        expectedReturn: 0, // Se calculará después
        timeToMaxProfit: 0, // Se calculará después
        riskLevel: 0, // Se calculará después
        alertTriggers: [],
        maxLoss: 0, // Se calculará después
      };
    });
  }
}
