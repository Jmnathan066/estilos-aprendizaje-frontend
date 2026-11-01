import { api } from './api.js';

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = document.getElementById('loginError');
    err.style.display = 'none';
    try {
        const { token } = await api('/login', {
            method: 'POST',
            body: { username: e.target.username.value, password: e.target.password.value },
        });
        sessionStorage.setItem('prof_token', token);
        location.href = '/panel.html';
    } catch (ex) {
        err.textContent = ex.message;
        err.style.display = 'block';
    }
});

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // MOSTRAR / OCULTAR CONTRASEÑA
    // ==========================================

    const password = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    if (password && togglePassword) {

        togglePassword.addEventListener('click', function () {

            if (password.type === 'password') {

                password.type = 'text';
                this.textContent = '🙈';
                this.setAttribute(
                    'aria-label',
                    'Ocultar contraseña'
                );

            } else {

                password.type = 'password';
                this.textContent = '👁';
                this.setAttribute(
                    'aria-label',
                    'Mostrar contraseña'
                );

            }

        });

    }


    // ==========================================
    // INFORMACIÓN DEL PROYECTO
    // ==========================================

    const projectInfo = document.getElementById('projectInfo');
    const projectInfoClose = document.getElementById('projectInfoClose');
    const projectInfoMini = document.getElementById('projectInfoMini');

    let infoTimer;


    function cerrarInfoProyecto() {

        if (!projectInfo) return;

        projectInfo.classList.add('project-info-hidden');

        setTimeout(function () {

            if (projectInfoMini) {

                projectInfoMini.classList.add(
                    'project-info-mini-visible'
                );

            }

        }, 350);

    }


    function abrirInfoProyecto() {

        if (!projectInfo) return;

        clearTimeout(infoTimer);

        if (projectInfoMini) {

            projectInfoMini.classList.remove(
                'project-info-mini-visible'
            );

        }

        projectInfo.classList.remove(
            'project-info-hidden'
        );

        infoTimer = setTimeout(function () {

            cerrarInfoProyecto();

        }, 5000);

    }


    // Botón X

    if (projectInfoClose) {

        projectInfoClose.addEventListener(
            'click',
            function () {

                clearTimeout(infoTimer);

                cerrarInfoProyecto();

            }
        );

    }


    // Botón pequeño de información

    if (projectInfoMini) {

        projectInfoMini.addEventListener(
            'click',
            function () {

                abrirInfoProyecto();

            }
        );

    }


    // Mostrar información al entrar

    if (projectInfo) {

        infoTimer = setTimeout(function () {

            cerrarInfoProyecto();

        }, 5000);

    }

});