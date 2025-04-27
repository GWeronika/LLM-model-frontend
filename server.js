const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    const botResponse = `Bot: response for "${message}"`;
    res.json({ reply: botResponse });
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
