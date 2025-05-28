const express = require('express');
const router = express.Router();
const { updateSheet, getLLMResponse} = require('../llm-comm/post');
const { mockResponse, extractCodeBlocks, persistCode, ensureDir } = require('../utils/codeUtils');

let conversations = require('./conversations').conversations || [];

router.post('/', async (req, res) => {
    const {
        message,
        user = 'Anonymous',
        category = 'default',
        conversationId
    } = req.body;

    try {
        await updateSheet(user, message, '', category, '', '');
    } catch (e) {
        console.error('updateSheet error:', e.message);
    }

    // const botResponse = mockResponse(message, category);
    const botResponse = await getLLMResponse();

    const codeBlocks = extractCodeBlocks(`${message}\n${botResponse}`);
    await ensureDir();
    for (const { lang, code } of codeBlocks) {
        await persistCode(lang.toLowerCase(), code);
    }

    let conversationsModule = require('./conversations');
    let conversations = conversationsModule.conversations || [];
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
        conv.messages.push({ sender: 'user', text: message });
        conv.messages.push({ sender: 'bot', text: botResponse });
        conv.updateDate = new Date().toISOString();
    }

    res.json({ reply: botResponse });
});

module.exports = router;
