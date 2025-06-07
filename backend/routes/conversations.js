const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { updateSheet, getLLMResponse} = require('../llm-comm/post');

var conv = null;
async function loadConversations() {
    if (conv) return conv;
    updateSheet('Anonymous', '', '', 'loadConversationData', '');
    conv = [];
    let queryStr = await getLLMResponse();
    if (queryStr === 'Timed out. Perhaps LLM is offline.') return conv;
    for (let entry of queryStr.split(";")) {
        let x = entry.split(",");
        conv.push({ id: x[0], title: x[1], updateDat: x[2], category: x[3], messages: []});
    }
    return conv;
}

let conversations = [
    {
        id: '1',
        title: 'Main chat',
        updateDate: '2025-05-12T12:00:00Z',
        category: 'Generation',
        messages: [
            { sender: 'user', text: 'Are you my assistant?' },
            { sender: 'bot', text: 'Yes, I am.' },
        ]
    }
];

router.get('/', async(_, res) => {
    if (conv === null){
        await loadConversations();
        conversations = [...conversations, ...conv];
    }
    res.json(conversations);
});

router.delete('/:id', async(req, res) => {
    const idToDeletion = req.params.id;
    const conv = conversations.find(c => c.id === idToDeletion);
    const updatedConversations = conversations.filter(c => c.id !== idToDeletion);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    await updateSheet('Anonymous', '', idToDeletion, 'deleteConversation', '', '');
    res.json(updatedConversations);
});

router.post('/', async(req, res) => {
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
    await updateSheet('Anonymous', newConv.updateDate, newConv.id, 'saveConversationData', newConv.title, newConv.category);
    res.json(newConv);
});

router.put('/:id', async(req, res) => {
    const conv = conversations.find(c => c.id === req.params.id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    conv.title = req.body.title;
    await updateSheet('Anonymous', '', conv.id, 'saveConversationData', conv.title, 'editTitle');
    res.json(conv);
});

module.exports = router;
