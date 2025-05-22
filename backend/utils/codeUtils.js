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

function mockResponse(message, category) {
    if (/class|def|function|import|console|System\.out/.test(message)) {
        if (category === 'Code Generation') {
            return 'Sure! Here\'s an example:\n\n```python\ndef hello():\n    print("Hello from mocked bot!")\n```';
        }
        if (category === 'Debugging') {
            return 'Your code has a small bug. Try:\n\n```js\nconsole.log("Debug info");\n```';
        }
    }

    const genericReplies = [
        'Interesting question! Let me think...\n\n```rust\nfn main() {\n    println!("Hello, World!");\n}\n```',
        'Here’s what I’d suggest...\n\n```css\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f4f4f4;\n    color: #333;\n}\n\nh1 {\n    color: #2c3e50;\n}\n```',
        'That depends. But one approach is:\n\n```python\ndef foo():\n\tprint("Hello World!")```',
        'I’d go with this solution:\n\n```java\npublic class Person {\n\tprivate String name;\n\tprivate int age;\n\n\tpublic Person(String name, int age) {\n\t\tthis.name = name;\n\t\tthis.age = age;\n\t}\n\n\tpublic String getName() {\n\t\treturn name;\n\t}\n\n\tpublic void setName(String name) {\n\t\tthis.name = name;\n\t}\n\n\tpublic int getAge() {\n\t\treturn age;\n\t}\n\n\tpublic void setAge(int age) {\n\t\tthis.age = age;\n\t}\n\n\tpublic String introduce() {\n\t\treturn "Hi, my name is " + name + " and I am " + age + " years old.";\n\t}\n}\n```'
    ];
    return genericReplies[Math.floor(Math.random() * genericReplies.length)];
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

async function persistCode(lang, snippet) {
    await ensureDir();
    const file = await suggestName(lang, snippet);
    await fs.writeFile(path.join(CODE_ROOT, file), snippet, 'utf-8');
    return file;
}

module.exports = {
    ensureDir,
    suggestName,
    mockResponse,
    extractCodeBlocks,
    persistCode,
    CODE_ROOT
};
