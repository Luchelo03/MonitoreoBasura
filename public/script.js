async function cargarDatos() {
  const [tachos, mediciones, alertas] = await Promise.all([
    fetch('/api/tachos').then(res => res.json()),
    fetch('/api/mediciones').then(res => res.json()),
    fetch('/api/alertas').then(res => res.json())
  ]);

  mostrarTachos(tachos);
  prepararMediciones(mediciones);
  mostrarAlertas(alertas);
}

function mostrarTachos(data) {
  const contenedor = document.getElementById('tachos-container');
  const [headers, ...rows] = data;

  rows.forEach(row => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${row[5]}" alt="Imagen del Tacho">
      <strong>ID:</strong> ${row[2]}<br>
      <strong>Dirección:</strong> ${row[3]}<br>
      <strong>Ubicación:</strong> ${row[4]}<br>
      <strong>Activo:</strong> ${row[6]}<br>
      <strong>Altura:</strong> ${row[7]} cm
    `;
    contenedor.appendChild(card);
  });
}

function prepararMediciones(data) {
  const [headers, ...rows] = data;
  const tachoSelect = document.getElementById('tacho-select');

  const tachosUnicos = [...new Set(rows.map(r => r[1]))];
  tachosUnicos.forEach(tid => {
    const opt = document.createElement('option');
    opt.value = tid;
    opt.textContent = tid;
    tachoSelect.appendChild(opt);
  });

  const ctx = document.getElementById('mediciones-chart').getContext('2d');
  let chart;

  function actualizarChart(tachoID) {
    const datosFiltrados = rows.filter(r => r[1] === tachoID);
    const labels = datosFiltrados.map(r => r[4]);
    const datos = datosFiltrados.map(r => parseFloat(r[3]));

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `% Llenado - ${tachoID}`,
          data: datos,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.3,
          fill: false
        }]
      }
    });
  }

  tachoSelect.addEventListener('change', (e) => {
    actualizarChart(e.target.value);
  });

  if (tachosUnicos.length > 0) {
    tachoSelect.value = tachosUnicos[0];
    actualizarChart(tachosUnicos[0]);
  }
}

function mostrarAlertas(data) {
  const contenedor = document.getElementById('alertas-container');
  const [headers, ...rows] = data;

  rows.forEach(row => {
    const div = document.createElement('div');
    div.className = 'alerta';
    div.innerHTML = `
      <strong>ID:</strong> ${row[0]} |
      <strong>Tacho:</strong> ${row[1]} |
      <strong>Fecha:</strong> ${row[2]}<br>
      <strong>% Llenado:</strong> ${row[3]}% |
      <strong>Estado:</strong> ${row[4]}<br>
      <strong>Notas:</strong> ${row[5]}
    `;
    contenedor.appendChild(div);
  });
}

cargarDatos();
