import { api } from './api.js';

const token = sessionStorage.getItem('prof_token');
if (!token) location.href = '/index.html';

const sel = document.getElementById('grado');
const tbody = document.getElementById('tbody');

function salir() {
  sessionStorage.removeItem('prof_token');
  location.href = '/index.html';
}

async function cargar() {
  const grado = sel.value;
  try {
    const d = await api(`/profesor/estudiantes${grado ? `?grado=${encodeURIComponent(grado)}` : ''}`, { token });

    if (sel.options.length === 1) {
      d.grados.forEach((g) => sel.add(new Option(g, g)));
      sel.value = grado;
    }

    tbody.replaceChildren();
    if (!d.estudiantes.length) {
      const td = Object.assign(document.createElement('td'), { colSpan: 7, className: 'empty-message', textContent: 'No hay estudiantes registrados.' });
      tbody.appendChild(document.createElement('tr')).appendChild(td);
      return;
    }
    d.estudiantes.forEach((e) => {
      const tr = tbody.insertRow();
      [e.nombre_completo, e.curso, e.activo, e.reflexivo, e.teorico, e.pragmatico, e.estilo].forEach((v, i) => {
        const td = tr.insertCell();
        if (i === 0) td.className = 'student-name';
        if (i === 6) {
          const s = Object.assign(document.createElement('span'), { className: 'style-badge', textContent: v ?? '' });
          td.appendChild(s);
        } else td.textContent = v ?? '';
      });
    });
  } catch (ex) {
    if (ex.status === 401) salir();
  }
}

document.getElementById('filterForm').addEventListener('submit', (e) => { e.preventDefault(); cargar(); });
document.getElementById('logoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await api('/logout', { method: 'POST', token }).catch(() => {});
  salir();
});

document.getElementById('excelBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  const grado = sel.value;
  const res = await api(`/profesor/excel${grado ? `?grado=${encodeURIComponent(grado)}` : ''}`, { token, raw: true });
  if (res.status === 401) return salir();
  const url = URL.createObjectURL(await res.blob());
  const a = Object.assign(document.createElement('a'), { href: url, download: grado ? `resultados_grado_${grado}.xlsx` : 'resultados_generales.xlsx' });
  a.click();
  URL.revokeObjectURL(url);
});

cargar();
