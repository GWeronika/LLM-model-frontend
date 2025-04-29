const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: './llm-comm/sheet-key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '1BcT1QrkEOvNpfmO_8fSMPnGdblZc5nNCVCFbPzTPMGc';
const range = 'Arkusz1!A2:H2';

async function updateSheet(id, req, dsc, type, code, err) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[id, req, dsc, type, code, err, 'FALSE', 'null']]
    },
  });
}

async function getLLMResponse(interval=5000) {
  await new Promise(resolve => setTimeout(resolve, interval));

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const range = 'Arkusz1!H2';

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const value =  res.data.values?.[0]?.[0];
  if (value === 'null' || value === null || value === undefined){
    return 'Timed out. Perhaps LLM is offline.';
  }
  return value;
}

module.exports = {
  updateSheet,
  getLLMResponse
};
