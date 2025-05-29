const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Simulamos los datos de los tachos (puedes luego adaptarlo a una API real)
const datosTachos = [
  { id: "TCH001", estado: "Lleno", porcentaje: 95 },
  { id: "TCH002", estado: "Vacío", porcentaje: 10 },
  { id: "TCH003", estado: "En proceso", porcentaje: 60 }
];

app.get('/', (req, res) => {
  res.send(`
    <h1>Dashboardd de Monitoreo de Basura</h1>
    <ul>
      ${datosTachos.map(t => `<li><strong>${t.id}</strong>: ${t.estado} (${t.porcentaje}%)</li>`).join('')}
    </ul>
  `);
});

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`);
});
