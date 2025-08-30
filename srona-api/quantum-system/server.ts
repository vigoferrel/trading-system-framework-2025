import express, { Request, Response } from 'express';
import { SronaApiService } from './srona/services/SronaApiService';

const app = express();
const PORT = 3002;

// Middleware para parsear JSON
app.use(express.json());

// Endpoint para obtener indicadores de BTC
app.get('/api/srona/indicators/BTC', async (req: Request, res: Response) => {
  try {
    const frequencyData = await SronaApiService.getFrequencyData();
    const temporalData = await SronaApiService.getTemporalData();
    const edgeMetrics = await SronaApiService.getEdgeMetrics();
    
    res.json({
      frequency: frequencyData,
      temporal: temporalData,
      edge: edgeMetrics
    });
  } catch (error) {
    console.error('Error obteniendo indicadores para BTC:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener indicadores de ETH
app.get('/api/srona/indicators/ETH', async (req: Request, res: Response) => {
  try {
    const frequencyData = await SronaApiService.getFrequencyData();
    const temporalData = await SronaApiService.getTemporalData();
    const edgeMetrics = await SronaApiService.getEdgeMetrics();
    
    res.json({
      frequency: frequencyData,
      temporal: temporalData,
      edge: edgeMetrics
    });
  } catch (error) {
    console.error('Error obteniendo indicadores para ETH:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener oportunidades
app.get('/api/srona/opportunities', async (req: Request, res: Response) => {
  try {
    const opportunities = await SronaApiService.getOpportunities();
    const copilotSuggestions = await SronaApiService.getCopilotSuggestions();
    
    res.json({
      opportunities,
      suggestions: copilotSuggestions
    });
  } catch (error) {
    console.error('Error obteniendo oportunidades:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor SRONA ejecutándose en http://localhost:${PORT}`);
});