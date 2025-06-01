const path = require('path');
const { google } = require('googleapis');

const keyFilePath = path.resolve(__dirname, 'sheet-key.json');

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '1BcT1QrkEOvNpfmO_8fSMPnGdblZc5nNCVCFbPzTPMGc';
const updateRange = 'Arkusz1!A2:H2';
const responseRange = 'Arkusz1!H2';

async function updateSheet(category = 'chat', query = '', projectId = 'dev', fName = 'main', convoId = 'dev') {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: updateRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[category, query, projectId, fName, convoId, '', 'FALSE', 'null']]
    },
  });
}

async function getLLMResponse(maxWaitMs = 15000, intervalMs = 1000) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: responseRange,
    });
    const value = res.data.values?.[0]?.[0];
    if (value && value !== 'null') {
      return value;
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  return 'Timed out. Perhaps LLM is offline.';
}

module.exports = {
  updateSheet,
  getLLMResponse
};
