export function detectLanguage(code) {
    const patterns = [
        { lang: 'python', regex: /^\s*(def |import |print\(|class )/m },
        { lang: 'javascript', regex: /^\s*(function |const |let |console\.log|=>)/m },
        { lang: 'typescript', regex: /^\s*(interface |type |import .* from )/m },
        { lang: 'java', regex: /^\s*(public |System\.out\.println|class )/m },
        { lang: 'cpp', regex: /^\s*(#include|std::|int main\(\))/m },
        { lang: 'c', regex: /^\s*(#include <stdio\.h>|int main\(\))/m },
        { lang: 'bash', regex: /^\s*(#!\/bin\/bash|echo |cd |ls )/m},
        { lang: 'html', regex: /^\s*<(!DOCTYPE html|html|head|body)/m },
        { lang: 'css', regex: /^\s*[.#]?\w+\s*{[^}]*}/m },
        { lang: 'json', regex: /^\s*{[\s\S]*?:[\s\S]*?}/m },
        { lang: 'xml', regex: /^\s*<\?xml|<\w+>/m },
        { lang: 'sql', regex: /^\s*(SELECT|INSERT|UPDATE|DELETE)\s+/i },
        { lang: 'go', regex: /^\s*package\s+main|fmt\./m },
        { lang: 'ruby', regex: /^\s*(def |puts |class |end)/m },
        { lang: 'php', regex: /^\s*<\?php|\$[a-zA-Z_]/m },
        { lang: 'kotlin', regex: /^\s*(fun |val |var |class )/m },
        { lang: 'rust', regex: /^\s*(fn |let |pub struct|use )/m },
        { lang: 'swift', regex: /^\s*(func |let |var |class )/m },
        { lang: 'r', regex: /^\s*(<-|library\(|print\(|function\()/m },
        { lang: 'perl', regex: /^\s*(use |sub |my )/m },
        { lang: 'lua', regex: /^\s*(local |function |print\()/m },
        { lang: 'scala', regex: /^\s*(object |def |val |var )/m },
        { lang: 'haskell', regex: /^\s*(import |data |main\s*=)/m },
        { lang: 'elixir', regex: /^\s*(defmodule |IO\.puts|def )/m },
        { lang: 'clojure', regex: /^\s*\(defn|def\s+[a-zA-Z]/m },
        { lang: 'groovy', regex: /^\s*(def |println |class )/m },
        { lang: 'objective-c', regex: /^\s*(#import |@interface |@implementation )/m },
        { lang: 'vhdl', regex: /^\s*(library |entity |architecture |process )/m },
        { lang: 'fortran', regex: /^\s*(program |print *,|end\s*program )/m },
        { lang: 'actionscript', regex: /^\s*(package |import |public class )/m },
        { lang: 'd', regex: /^\s*(import |void\s*main|version )/m },
    ];

    for (const { lang, regex } of patterns) {
        if (regex.test(code)) return lang;
    }

    return 'text';
}
