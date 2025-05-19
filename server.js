const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { updateSheet, getLLMResponse } = require('./llm-comm/post');


const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    const { message, user = 'Anonymous' } = req.body;

    try {
        await updateSheet(user, message, '', 'default', '', '');
    } catch (error) {
        console.error('Error writing to database:', error.message);
        res.status(500).json({ error: 'Failed to write to database'});
        return;
    }

    const botResponse = await getLLMResponse();
    res.json({ reply: botResponse});
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
