const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function readFileLineByLine(filePath, onLineCallback) {
    return new Promise((resolve, reject) => {
        const inputStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
        const rl = readline.createInterface({ input: inputStream, crlfDelay: Infinity });

        rl.on('line', async (line) => {
            try {
                await onLineCallback(line);
            } catch (err) {
                rl.close();
                reject(err);
            }
        });

        rl.on('close', () => {
            resolve();
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = { readFileLineByLine };
