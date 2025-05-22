export function suggestFileName(lang, code) {
    let base = 'snippet';
    if (lang === 'java') {
        const m = code.match(/class\s+(\w+)/);
        if (m) base = m[1];
    } else if (lang === 'python') {
        const m = code.match(/def\s+(\w+)/);
        if (m) base = m[1];
    } else if (lang === 'javascript' || lang === 'typescript') {
        const m = code.match(/function\s+(\w+)/);
        if (m) base = m[1];
    }

    const extMap = {
        python: 'py',
        javascript: 'js',
        typescript: 'ts',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        bash: 'sh',
        html: 'html',
        css: 'css',
        json: 'json',
        xml: 'xml',
        sql: 'sql',
        go: 'go',
        ruby: 'rb',
        php: 'php',
        kotlin: 'kt',
        rust: 'rs',
        swift: 'swift',
        r: 'r',
        perl: 'pl',
        lua: 'lua',
        scala: 'scala',
        haskell: 'hs',
        elixir: 'ex',
        clojure: 'clj',
        groovy: 'groovy',
        'objective-c': 'm',
        vhdl: 'vhdl',
        fortran: 'f90',
        actionscript: 'as',
        d: 'd',
        text: 'txt'
    };

    const ext = extMap[lang] || 'txt';
    return `${base}.${ext}`;
}
