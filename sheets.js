require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Paso 1: Obtener el JSON desde la variable de entorno y escribirlo en un archivo temporal
const credentialsPath = path.join(__dirname, 'temp_credentials.json');
fs.writeFileSync(credentialsPath, process.env.GOOGLE_SERVICE_ACCOUNT_FILE);

// Paso 2: Crear el cliente de autenticación con la ruta del archivo temporal
const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
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
    getSheetData(process.env.GOOGLE_SHEET_ID_TACHOS, 'Hoja 1!A1:H'),
  getMediciones: () =>
    getSheetData(process.env.GOOGLE_SHEET_ID_MEDICIONES, 'Sheet1!A1:E'),
  getAlertas: () =>
    getSheetData(process.env.GOOGLE_SHEET_ID_ALERTAS, 'Sheet1!A1:F'),
};
