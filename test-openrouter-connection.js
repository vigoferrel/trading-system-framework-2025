#!/usr/bin/env node

/**
 * Test simple de conexión con OpenRouter
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

async function testOpenRouterConnection() {
    console.log('🔑 API Key:', OPENROUTER_API_KEY.substring(0, 20) + '...');
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://qbtc-trading-system.com',
                'X-Title': 'QBTC Quantum Trading System'
            },
            body: JSON.stringify({
                model: 'google/gemini-flash-1.5-8b',
                messages: [
                    {
                        role: 'user',
                        content: 'Hello, this is a test connection for QBTC Quantum Trading System. Please respond with "Connection successful".'
                    }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });

        console.log('📡 Response Status:', response.status);
        console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ Error Response:', errorText);
            return false;
        }

        const data = await response.json();
        console.log('✅ Success Response:', JSON.stringify(data, null, 2));
        return true;

    } catch (error) {
        console.log('💥 Connection Error:', error.message);
        return false;
    }
}

// Ejecutar test
testOpenRouterConnection().then(success => {
    console.log('\n🎯 Test Result:', success ? 'SUCCESS' : 'FAILED');
    process.exit(success ? 0 : 1);
});
