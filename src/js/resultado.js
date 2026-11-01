import { api } from './api.js';

const token = new URLSearchParams(location.search).get('t');
if (!token) location.href = '/formulario.html';

const $ = (id) => document.getElementById(id);

(async () => {
try {
  const r = await api(`/resultado/${token}`);
  $('nombre').textContent = r.nombre_completo;
  $('estilo').textContent = r.estilo_aprendizaje;
  $('p-activo').textContent = r.puntajes['Activo'];
  $('p-reflexivo').textContent = r.puntajes['Reflexivo'];
  $('p-teorico').textContent = r.puntajes['Teórico'];
  $('p-pragmatico').textContent = r.puntajes['Pragmático'];
  if (r.correo) document.getElementById('correo').value = r.correo;
} catch {
  location.href = '/formulario.html';
}
})();

$('correoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('mensaje');
  const btn = e.target.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  try {
    const r = await api(`/resultado/${token}/correo`, { method: 'POST', body: { correo: $('correo').value } });
    msg.textContent = r.message;
  } catch (ex) {
    msg.textContent = ex.message;
  }
  msg.style.display = 'block';
  btn.disabled = false;
  btn.textContent = 'Enviar material';
});
