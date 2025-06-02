require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_FILE),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function getSheetData(sheetId, range) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });
    return response.data.values;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return null;
  }
}

module.exports = {
  getTachos: () =>
    getSheetData(process.env.GOOGLE_SHEET_ID_TACHOS, 'Hoja 1!A1:H4'),
  getMediciones: () =>
    getSheetData(process.env.GOOGLE_SHEET_ID_MEDICIONES, 'Sheet1!A1:E51'),
  getAlertas: () =>
    getSheetData(process.env.GOOGLE_SHEET_ID_ALERTAS, 'Sheet1!A1:F10'),
};
