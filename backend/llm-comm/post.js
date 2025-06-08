const path = require('path');
const { google } = require('googleapis');
const axios = require('axios');
const Papa = require('papaparse');
const keyFilePath = path.resolve(__dirname, 'sheet-key.json');

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '1BcT1QrkEOvNpfmO_8fSMPnGdblZc5nNCVCFbPzTPMGc';
const url = 'https://docs.google.com/spreadsheets/d/1BcT1QrkEOvNpfmO_8fSMPnGdblZc5nNCVCFbPzTPMGc/export?format=csv';
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

async function getLLMResponse(interval = 500, depth=0) {
  await new Promise(resolve => setTimeout(resolve, interval));

  try {
    const response = await axios.get(url);
    const parsed = Papa.parse(response.data, { skipEmptyLines: true });

    const value = parsed.data?.[1]?.[7];
    if (!value || value === 'null') {
      if (depth < 30) return getLLMResponse(url, depth + 1);
      return 'Timed out. Perhaps LLM is offline.';
    }
    return value;
  } catch (error) {
    console.error('Error fetching sheet:', error.message);
    if (depth < 30) return getLLMResponse(url, depth + 1);
    return 'Timed out. Perhaps LLM is offline.';
  }
}

module.exports = {
  updateSheet,
  getLLMResponse
};
