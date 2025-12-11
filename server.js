// Simple proxy server to call OpenAI's Chat Completions API.
// Run with: OPENAI_API_KEY=sk-... node server.js
// Then open your frontend at http://localhost:3000

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // serve index.html and assets from project root

app.post('/api/chat', async (req, res) => {
    const { message } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'OPENAI_API_KEY is not set on the server.' });
    }
    if (!message) {
        return res.status(400).json({ error: 'message is required' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: message }],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            return res.status(response.status).json({ error: errText || 'OpenAI API error' });
        }

        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content?.trim() || 'No response';
        res.json({ reply });
    } catch (error) {
        console.error('OpenAI request failed:', error);
        res.status(500).json({ error: 'Chat request failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

