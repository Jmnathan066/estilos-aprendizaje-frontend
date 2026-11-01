import { api } from './api.js';
import { PREGUNTAS } from './preguntas.js';

const estudiante = JSON.parse(sessionStorage.getItem('estudiante') || 'null');
if (!estudiante) location.href = '/formulario.html';

const cont = document.getElementById('questions');
const nums = document.getElementById('questionNumbers');

PREGUNTAS.forEach(({ id, texto }) => {
  const card = document.createElement('article');
  card.className = 'question-card';
  card.id = `pregunta-${id}`;
  card.innerHTML = `
    <div class="question-number">${id}</div>
    <div class="question-content">
      <p></p>
      <div class="answers">
        <label class="answer-option"><input type="radio" name="pregunta${id}" value="1"><span class="answer-button"><strong>1</strong> Sí</span></label>
        <label class="answer-option"><input type="radio" name="pregunta${id}" value="0"><span class="answer-button"><strong>0</strong> No</span></label>
      </div>
    </div>`;
  card.querySelector('p').textContent = texto;
  cont.appendChild(card);

  const a = document.createElement('a');
  a.href = `#pregunta-${id}`;
  a.id = `nav-question-${id}`;
  a.className = 'question-number-link' + (id > 50 ? ' hidden-question' : '');
  a.textContent = id;
  nums.appendChild(a);
});

const contador = document.getElementById('answered-count');
const toggle = document.getElementById('navigation-toggle');
const links = document.querySelectorAll('.question-number-link');

document.querySelectorAll('.answer-option input').forEach((r) =>
  r.addEventListener('change', function () {
    document.getElementById('nav-question-' + this.name.replace('pregunta', '')).classList.add('answered');
    let n = 0;
    for (let i = 1; i <= 80; i++) if (document.querySelector(`input[name="pregunta${i}"]:checked`)) n++;
    contador.textContent = n;
  })
);

let primeras = true;
toggle.addEventListener('click', () => {
  primeras = !primeras;
  links.forEach((l) => {
    const n = parseInt(l.textContent.trim());
    l.classList.toggle('hidden-question', primeras ? n > 50 : n <= 50);
  });
  toggle.textContent = primeras ? '↓' : '↑';
  toggle.setAttribute('aria-label', primeras ? 'Mostrar preguntas 51 a 80' : 'Mostrar preguntas 1 a 50');
});

document.getElementById('surveyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('surveyMsg');
  const respuestas = {};
  for (let i = 1; i <= 80; i++) {
    const c = document.querySelector(`input[name="pregunta${i}"]:checked`);
    if (!c) {
      msg.textContent = `Falta responder la pregunta ${i}.`;
      document.getElementById(`pregunta-${i}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    respuestas[i] = Number(c.value);
  }

  const btn = document.getElementById('surveyBtn');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  try {
    const r = await api('/encuesta', { method: 'POST', body: { ...estudiante, respuestas } });
    sessionStorage.removeItem('estudiante');
    location.href = `/resultado.html?t=${r.token}`;
  } catch (ex) {
    msg.textContent = ex.message;
    btn.disabled = false;
    btn.textContent = 'Enviar respuestas';
  }
});
