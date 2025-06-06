const express = require('express');
const router = express.Router();
const { updateSheet, getLLMResponse} = require('../llm-comm/post');
const { conversations } = require('./conversations');

router.post('/', async (req, res) => {
    const {
        message,
        user = 'Anonymous',
        conversationId = null,
    } = req.body;

    try {
        await updateSheet(user, message, conversationId || 'dev', 'default');
    } catch (e) {
        console.error('updateSheet error:', e.message);
        res.status(500).json({ error: 'Failed to write to database'});
    }

    // const botResponse = mockResponse(message, category);
    let botResponse;
    try {
        botResponse = await getLLMResponse();
    } catch (err) {
        console.error('getLLMResponse error:', err.message);
        return res.status(500).json({ error: 'Failed to get LLM response' });
    }

    if (conversationId) {
        const conv = conversations.find(c => c.id === conversationId);
        if (conv) {
            conv.messages.push({ sender: 'user', text: message });
            conv.messages.push({ sender: 'bot', text: botResponse });
            conv.updateDate = new Date().toISOString();
        }
    }

    res.json({ reply: botResponse });
});

module.exports = router;
