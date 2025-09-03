/**
 * SENTIMENT DASHBOARD SERVER
 * ==========================
 */

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 4604;

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'active',
        service: 'Sentiment Dashboard Server',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API endpoint for sentiment analysis
app.get('/api/sentiment', (req, res) => {
    res.json({
        sentiment: {
            overall: 'BULLISH',
            confidence: 0.72,
            socialMedia: 'POSITIVE',
            news: 'NEUTRAL',
            whaleActivity: 'ACTIVE'
        },
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`[SENTIMENT DASHBOARD SERVER] Running on port ${PORT}`);
});
