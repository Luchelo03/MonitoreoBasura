const express = require('express');
const path = require('path');
const {
  getTachos,
  getMediciones,
  getAlertas,
} = require('./sheets');

const app = express();
const PORT = 3000;

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// API REST para frontend
app.get('/api/tachos', async (req, res) => {
  try {
    const data = await getTachos();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos de Tachos');
  }
});

app.get('/api/mediciones', async (req, res) => {
  try {
    const data = await getMediciones();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos de Mediciones');
  }
});

app.get('/api/alertas', async (req, res) => {
  try {
    const data = await getAlertas();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos de Alertas');
  }
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
