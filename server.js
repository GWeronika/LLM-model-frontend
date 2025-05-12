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
        await updateSheet(user, message, '', 'default', '', '', 'false');
    } catch (error) {
        console.error('Error writing to database:', error.message);
        res.status(500).json({ error: 'Failed to write to database'});
        return;
    }

    const botResponse = await getLLMResponse();
    res.json({ reply: botResponse});
});

app.get('/conversations', async (req, res) => {
    // TODO: get conversations from the db
    res.json([
        {
            id: '1',
            title: 'Discussing React component structure',
            updateDate: '2025-05-12T12:00:00Z',
            messages: [
                { sender: 'user', text: 'How should I structure my components in React?' },
                { sender: 'bot', text: 'It depends on your app, but usually by feature...' },
            ]
        },
        {
            id: '2',
            title: 'Python code to connect to MongoDB',
            updateDate: '2025-05-11T08:20:00Z',
            messages: [
                { sender: 'user', text: 'How do I connect to MongoDB in Python?' },
                { sender: 'bot', text: 'You can use pymongo library like this:\n\n```python\nimport pymongo\n```' },
            ]
        }
    ]);
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
