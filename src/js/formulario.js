document.getElementById('studentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const datos = {
    nombre: f.nombre.value.trim(),
    segundo_nombre: f.segundo_nombre.value.trim() || null,
    apellido: f.apellido.value.trim(),
    segundo_apellido: f.segundo_apellido.value.trim() || null,
    correo: f.correo.value.trim() || null,
    curso: f.curso.value,
  };
  sessionStorage.setItem('estudiante', JSON.stringify(datos));
  location.href = '/encuesta.html';
});
