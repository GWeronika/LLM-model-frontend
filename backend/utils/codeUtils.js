const path = require('path');
const fs = require('fs/promises');
const { detectLanguage } = require('./detectLanguage');

const CODE_ROOT = path.join(
    process.env.HOME || process.env.USERPROFILE,
    'Documents/YourLLM/projects'
);

async function ensureDir() {
    await fs.mkdir(CODE_ROOT, { recursive: true });
}

async function suggestName(lang, code) {
    let base = 'snippet';
    if (lang === 'java') {
        const m = code.match(/class\s+(\w+)/);
        if (m) base = m[1];
    } else if (lang === 'python') {
        const m = code.match(/def\s+(\w+)/);
        if (m) base = m[1];
    }

    if (!lang || lang === 'text') {
        lang = detectLanguage(code);
    }

    const extMap = {
        java: '.java',
        python: '.py',
        javascript: '.js',
        typescript: '.ts',
        cpp: '.cpp',
        c: '.c',
        bash: '.sh',
        html: '.html',
        css: '.css',
        json: '.json',
        xml: '.xml',
        sql: '.sql',
        go: '.go',
        ruby: '.rb',
        php: '.php',
        kotlin: '.kt',
        rust: '.rs',
        swift: '.swift',
        r: '.r',
        perl: '.pl',
        lua: '.lua',
        scala: '.scala',
        haskell: '.hs',
        elixir: '.ex',
        clojure: '.clj',
        groovy: '.groovy',
        'objective-c': '.m',
        vhdl: '.vhdl',
        fortran: '.f90',
        actionscript: '.as',
        d: '.d',
    };
    const ext = extMap[lang] || '.txt';

    let name = base + ext;
    let idx = 1;
    while (true) {
        try {
            await fs.access(path.join(CODE_ROOT, name));
            name = `${base}_${idx++}${ext}`;
        } catch {
            return name;
        }
    }
}

function extractCodeBlocks(text) {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        codeBlocks.push({ lang: match[1] || 'txt', code: match[2].trim() });
    }
    return codeBlocks;
}

module.exports = {
    ensureDir,
    extractCodeBlocks,
    CODE_ROOT
};
