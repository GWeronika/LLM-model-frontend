const { updateSheet, getLLMResponse } = require('./post');

async function getConversationMessages(conversationId) {
    const category = 'getSelect';
    const query = `SELECT * FROM conversations WHERE conversationId = '${conversationId}' ORDER BY id ASC`;
    await updateSheet(category, query, 'dev', 'default', '');
    const results = await getLLMResponse();
    if (!Array.isArray(results)) return [];
    return results.map(row => ({
        text: row.query,
        sender: row.userQuery ? 'user' : 'bot',
        category: row.category,
        id: row.id
    }));
}

async function createConversation(conversation) {
    const category = 'saveConversation';
    const payload = {
        projectName: 'dev',
        conversationId: conversation.id,
        category: conversation.category || '',
        query: conversation.query || '',
        userQuery: false
    };
    await updateSheet(category, JSON.stringify(payload), 'dev', 'default', '');
    return conversation;
}

async function updateConversation(id, newTitle) {
    // const selectCategory = 'getSelect';
    // const selectQuery = `SELECT * FROM conversations WHERE id = '${id}'`;
    // await updateSheet(selectCategory, selectQuery, 'dev', 'default', '');
    // const results = await getLLMResponse();
    // if (!Array.isArray(results) || results.length === 0) {
    //     return null;
    // }
    // const conversation = results[0];
    // conversation.title = newTitle;
    // conversation.updateDate = new Date().toISOString();
    // const updateCategory = 'updateConversation';
    // await updateSheet(updateCategory, '', 'dev', 'default', conversation);
    // return conversation;
    console.log("TODO: update conversation")
}

async function saveMessage(conversationId, messageText, isUserQuery, category = '', projectName = 'dev') {
    const categoryKey = 'saveConversation';
    const payload = {
        projectName,
        conversationId,
        category,
        query: messageText,
        userQuery: isUserQuery
    };
    await updateSheet(categoryKey, '', projectName, 'default', JSON.stringify(payload));
    return payload;
}

module.exports = {
    getAllConversations: async () => {
        const category = 'getSelect';
        const query = 'SELECT * FROM conversations';
        await updateSheet(category, query, 'dev', 'default', '');
        return await getLLMResponse();
    },
    createConversation,
    updateConversation,
    getConversationMessages,
    saveMessage,
};
