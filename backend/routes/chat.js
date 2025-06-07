const express = require('express');
const router = express.Router();
const { updateSheet, getLLMResponse} = require('../llm-comm/post');
const { conversations } = require('./conversations');

router.post('/', async (req, res) => {
    console.log(req.body);
    const {
        message,
        user = 'Anonymous',
        conversationId,
        category
    } = req.body;

    try {
        await updateSheet(user, message, conversationId || 'dev', category || 'default');
    } catch (e) {
        console.error('updateSheet error:', e.message);
        res.status(500).json({ error: 'Failed to write to database'});
    }

    let botResponse;
    try {
        botResponse = await getLLMResponse();
    } catch (err) {
        console.error('getLLMResponse error:', err.message);
        return res.status(500).json({ error: 'Failed to get LLM response' });
    }
    res.json({ reply: botResponse });
});

module.exports = router;
