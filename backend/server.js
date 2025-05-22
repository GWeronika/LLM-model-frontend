const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const conversationsRoutes = require('./routes/conversations');
const chatRoutes = require('./routes/chat');
const filesRoutes = require('./routes/files');

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/plain' }));

app.use('/conversations', conversationsRoutes);
app.use('/chat', chatRoutes);
app.use('/files', filesRoutes);

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
