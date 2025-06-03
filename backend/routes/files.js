const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const { ensureDir, extractCodeBlocks } = require('../utils/codeUtils');
const { readFileLineByLine } = require('../utils/readLineUtils');
const { updateSheet} = require('../llm-comm/post');


const CODE_ROOT = path.join(
    process.env.HOME || process.env.USERPROFILE,
    'Documents/YourLLM/projects'
);

router.get('/list', async (_, res) => {
    try {
        await ensureDir();
        const files = await fs.readdir(CODE_ROOT);
        res.json(files);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/:name', async (req, res) => {
    try {
        const data = await fs.readFile(
            path.join(CODE_ROOT, req.params.name),
            'utf-8'
        );
        res.type('text/plain').send(data);
    } catch {
        res.status(404).send('File not found');
    }
});

router.get('/files/:fileName', async (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'files', fileName);

    let content = '';
    try {
        await readFileLineByLine(filePath, (line) => {
            content += line + '\n';
        });
        res.send(content);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read file' });
    }
});

router.put('/:name', async (req, res) => {
    try {
        await ensureDir();
        await fs.writeFile(
            path.join(CODE_ROOT, req.params.name),
            req.body,
            'utf-8'
        );
        res.sendStatus(204);
        updateSheet('Anonymous', req.body, '', 'saveFunction', req.params.name) // saveFunction call to model+db server on creation
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete('/:name', async (req, res) => {
    try {
        await fs.unlink(path.join(CODE_ROOT, req.params.name));
        updateSheet('Anonymous', '', '', 'deleteFunction', req.params.name); // deleteFunction call to model+db server on deletion
        res.sendStatus(204);
    } catch {
        res.status(404).json({ error: 'File not found' });
    }
});

router.post('/save-code', async (req, res) => {
    const { conversationText, fileName } = req.body;

    if (!conversationText || !fileName) {
        return res.status(400).json({ error: 'Brakuje conversationText lub fileName' });
    }

    try {
        const codeBlocks = extractCodeBlocks(conversationText);
        if (codeBlocks.length === 0) {
            return res.status(400).json({ error: 'Nie znaleziono bloków kodu w tekście' });
        }
        await ensureDir();

        const content = codeBlocks.map(cb => `// Language: ${cb.lang}\n${cb.code}`).join('\n\n');
        const filePath = path.join(CODE_ROOT, fileName);
        await fs.writeFile(filePath, content, 'utf-8');
        updateSheet('Anonymous', content, '', 'saveFunction', fileName) // saveFunction call to model+db server on creation
        res.json({ message: `Zapisano ${codeBlocks.length} bloków kodu do pliku ${fileName}` });
    } catch (e) {
        console.error('save-code error:', e);
        res.status(500).json({ error: 'Błąd zapisu pliku' });
    }
});

module.exports = router;
