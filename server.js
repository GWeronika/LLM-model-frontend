// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { updateSheet, getLLMResponse } = require('./llm-comm/post');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let conversations = [
    {
        id: '1',
        title: 'Discussing React component structure',
        updateDate: '2025-05-12T12:00:00Z',
        category: 'Explaining',
        messages: [
            { sender: 'user', text: 'How should I structure my components in React?' },
            { sender: 'bot', text: 'It depends on your app, but usually by feature...' },
        ]
    },
    {
        id: '2',
        title: 'Python code to connect to MongoDB',
        updateDate: '2025-05-11T08:20:00Z',
        category: 'Code Generation',
        messages: [
            { sender: 'user', text: 'How do I connect to MongoDB in Python?' },
            { sender: 'bot', text: 'You can use pymongo library like this:\n\n```python\nimport pymongo\n```' },
        ]
    }
];

app.get('/conversations', async (req, res) => {
    res.json(conversations);
});

app.post('/conversations', async (req, res) => {
    const { category } = req.body;
    const id = uuidv4();
    const newConv = {
        id,
        title: `New ${category} Conversation`,
        updateDate: new Date().toISOString(),
        category,
        messages: []
    };
    conversations.push(newConv);
    res.json(newConv);

    // await db.insertConversation(newConv);
});

app.put('/conversations/:id', async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const conversationIndex = conversations.findIndex(c => c.id === id);
    if (conversationIndex === -1) {
        return res.status(404).json({ error: 'Conversation not found' });
    }

    conversations[conversationIndex].title = title;
    res.json(conversations[conversationIndex]);
});

app.post('/chat', async (req, res) => {
    const { message, user = 'Anonymous', category = 'default', conversationId } = req.body;

    try {
        await updateSheet(user, message, '', category, '', '', 'false');
    } catch (error) {
        console.error('Error writing to database:', error.message);
        res.status(500).json({ error: 'Failed to write to database' });
        return;
    }

    // const botResponse = await callModel(category, message);
    const botResponse = await getLLMResponse();

    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
        conversation.messages.push({ sender: 'user', text: message });
        conversation.messages.push({ sender: 'bot', text: botResponse });
        conversation.updateDate = new Date().toISOString();
    }

    res.json({ reply: botResponse });

    // await db.addMessage(conversationId, { sender: 'user', text: message });
    // await db.addMessage(conversationId, { sender: 'bot', text: botResponse });
});

/*
async function callModel(category, message) {
    switch (category) {
        case 'Code Generation':
            return await callCodeGenModel(message);
        case 'Code Documentation':
            return await callDocGenModel(message);
        case 'Debugging':
            return await callDebugModel(message);
        case 'Explaining':
            return await callExplainerModel(message);
        default:
            return 'Category not recognized.';
    }
}
*/

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
