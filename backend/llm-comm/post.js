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

async function updateSheet(projectId = 'dev', query = '', convoId = 'dev', category = 'chat', fName = 'main', convoCat='') {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: updateRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[category, query, projectId, fName, convoId, convoCat, 'FALSE', 'null']]
    },
  });
}

async function getLLMResponse(interval = 5000, depth=0) {
  await new Promise(resolve => setTimeout(resolve, interval));

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: responseRange,
  });

  const value = res.data.values?.[0]?.[0];
  if (!value || value === 'null') {
    if (depth < 2) return getLLMResponse(depth=depth+1);
    return 'Timed out. Perhaps LLM is offline.';
  }
  return value;
}

module.exports = {
  updateSheet,
  getLLMResponse
};
