const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const {
    getAllConversations,
    createConversation,
    updateConversation,
    getConversationMessages,
    saveMessage,
} = require('../llm-comm/db');

router.get('/', async (req, res) => {
    try {
        const conversations = await getAllConversations();
        res.json(conversations);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { category } = req.body;
        const id = uuidv4();

        const newConv = {
            id,
            title: `New ${category} Conversation`,
            updateDate: new Date().toISOString(),
            category,
            messages: [],
        };

        const savedConv = await createConversation(newConv);
        res.json(savedConv);
    } catch (err) {
        console.error('Error creating conversation:', err);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title } = req.body;

        const updatedConv = await updateConversation(id, title);
        if (!updatedConv) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        res.json(updatedConv);
    } catch (err) {
        console.error('Error updating conversation:', err);
        res.status(500).json({ error: 'Failed to update conversation' });
    }
});

router.get('/:conversationId/messages', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await getConversationMessages(conversationId);
        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

router.post('/:conversationId/messages', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text, userQuery, category } = req.body;

        if (typeof text !== 'string' || typeof userQuery !== 'boolean') {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const savedMsg = await saveMessage(conversationId, text, userQuery, category || '');
        res.json(savedMsg);
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

module.exports = router;
