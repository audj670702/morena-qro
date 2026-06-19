/*
MORENA QRO Capacitación
Archivo: js/app.js
Versión: v1.1
Alcance: lógica base de navegación PWA usuario
*/

/* =========================================================
   BLOQUE 01. CONFIGURACIÓN
   ========================================================= */

const APP_VERSION = 'v1.1';

const APP_CONFIG = {
  nombre: 'MORENA QRO',
  subtitulo: 'Capacitación · Querétaro',
  versionLabel: 'MORENA QRO Capacitación · v1.1'
};

/* =========================================================
   BLOQUE 02. ESTADO GLOBAL
   ========================================================= */

const appState = {
  vistaActual: 'inicio',
  usuario: {
    nombre: 'Usuario MORENA',
    codigo: 'USU-0000',
    rol: 'USU',
    municipio: 'Querétaro'
  }
};

/* =========================================================
   BLOQUE 03. DATOS TEMPORALES
   ========================================================= */

const datosDemo = {
  documentos: [
    {
      titulo: 'Documento base de capacitación',
      codigo: 'DOC-0001',
      tipo: 'PDF',
      estado: 'Disponible'
    }
  ],

  actividades: [
    {
      titulo: 'Actividad de capacitación inicial',
      codigo: 'ACT-0001',
      fecha: 'Pendiente',
      estado: 'Publicada'
    }
  ],

  multimedia: [
    {
      titulo: 'Material audiovisual inicial',
      codigo: 'MUL-0001',
      tipo: 'Video',
      estado: 'Disponible'
    }
  ],

  mensajes: [
    {
      titulo: 'Aviso de sistema',
      codigo: 'MSG-0001',
      texto: 'Bienvenido a la plataforma de capacitación.',
      estado: 'Nuevo'
    }
  ]
};

/* =========================================================
   BLOQUE 04. UTILIDADES
   ========================================================= */

function $(selector) {
  return document.querySelector(selector);
}

function obtenerParametroURL(nombre) {
  const params = new URLSearchParams(window.location.search);
  return params.get(nombre) || '';
}

function escapeHTML(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setVista(vista) {
  appState.vistaActual = vista;
  renderApp();
}

/* =========================================================
   BLOQUE 05. NAVEGACIÓN
   ========================================================= */

function renderNavCard(icono, titulo, desc, vista) {
  return `
    <button class="nav-card" type="button" data-view="${escapeHTML(vista)}">
      <div class="nav-icon">${escapeHTML(icono)}</div>
      <p class="nav-title">${escapeHTML(titulo)}</p>
      <p class="nav-desc">${escapeHTML(desc)}</p>
    </button>
  `;
}

function renderBackButton() {
  return `
    <div class="actions">
      <button class="btn btn-secondary" type="button" data-view="inicio">
        Volver
      </button>
      <button class="btn btn-secondary" type="button" data-action="refresh">
        Actualizar
      </button>
    </div>
  `;
}

/* =========================================================
   BLOQUE 06. RENDER PRINCIPAL
   ========================================================= */

function renderApp() {
  const root = $('#appRoot');

  if (!root) {
    return;
  }

  root.innerHTML = `
    <main class="app">
      ${renderHeader()}
      <section class="app-body">
        ${renderVista()}
      </section>
      <footer class="app-version">
        ${escapeHTML(APP_CONFIG.versionLabel)}
      </footer>
    </main>
  `;

  bindEventos();
}

function renderHeader() {
  return `
    <header class="app-header">
      <div class="app-logo">M</div>
      <h1 class="app-title">${escapeHTML(APP_CONFIG.nombre)}</h1>
      <p class="app-subtitle">${escapeHTML(APP_CONFIG.subtitulo)}</p>
    </header>
  `;
}

function renderVista() {
  switch (appState.vistaActual) {
    case 'documentos':
      return renderDocumentos();

    case 'actividades':
      return renderActividades();

    case 'multimedia':
      return renderMultimedia();

    case 'mensajes':
      return renderMensajes();

    case 'perfil':
      return renderPerfil();

    default:
      return renderInicio();
  }
}

/* =========================================================
   BLOQUE 07. RENDER INICIO
   ========================================================= */

function renderInicio() {
  return `
    <section>
      <h2 class="section-title">Inicio</h2>
      <p class="section-note">
        Consulta tus materiales, actividades, avisos y datos de perfil.
      </p>

      <article class="info-card">
        <h3 class="info-title">${escapeHTML(appState.usuario.nombre)}</h3>
        <p class="info-meta">
          ${escapeHTML(appState.usuario.codigo)} · ${escapeHTML(appState.usuario.rol)} · ${escapeHTML(appState.usuario.municipio)}
        </p>
      </article>

      <div class="nav-grid">
        ${renderNavCard('D', 'Documentos', 'Materiales disponibles', 'documentos')}
        ${renderNavCard('A', 'Actividades', 'Agenda y capacitación', 'actividades')}
        ${renderNavCard('M', 'Multimedia', 'Videos y recursos', 'multimedia')}
        ${renderNavCard('✉', 'Mensajes', 'Avisos recibidos', 'mensajes')}
        ${renderNavCard('P', 'Perfil', 'Datos personales', 'perfil')}
      </div>
    </section>
  `;
}

/* =========================================================
   BLOQUE 08. RENDER DOCUMENTOS
   ========================================================= */

function renderDocumentos() {
  return `
    <section>
      <h2 class="section-title">Documentos</h2>
      <p class="section-note">Biblioteca disponible para consulta.</p>

      <div class="list">
        ${datosDemo.documentos.map((item) => `
          <article class="list-row">
            <div>
              <p class="list-title">${escapeHTML(item.titulo)}</p>
              <p class="list-meta">${escapeHTML(item.codigo)} · ${escapeHTML(item.tipo)}</p>
            </div>
            <span class="badge ok">${escapeHTML(item.estado)}</span>
          </article>
        `).join('')}
      </div>

      ${renderBackButton()}
    </section>
  `;
}

/* =========================================================
   BLOQUE 09. RENDER ACTIVIDADES
   ========================================================= */

function renderActividades() {
  return `
    <section>
      <h2 class="section-title">Actividades</h2>
      <p class="section-note">Actividades de capacitación disponibles.</p>

      <div class="list">
        ${datosDemo.actividades.map((item) => `
          <article class="list-row">
            <div>
              <p class="list-title">${escapeHTML(item.titulo)}</p>
              <p class="list-meta">${escapeHTML(item.codigo)} · ${escapeHTML(item.fecha)}</p>
            </div>
            <span class="badge">${escapeHTML(item.estado)}</span>
          </article>
        `).join('')}
      </div>

      ${renderBackButton()}
    </section>
  `;
}

/* =========================================================
   BLOQUE 10. RENDER MULTIMEDIA
   ========================================================= */

function renderMultimedia() {
  return `
    <section>
      <h2 class="section-title">Multimedia</h2>
      <p class="section-note">Videos, enlaces y materiales de apoyo.</p>

      <div class="list">
        ${datosDemo.multimedia.map((item) => `
          <article class="list-row">
            <div>
              <p class="list-title">${escapeHTML(item.titulo)}</p>
              <p class="list-meta">${escapeHTML(item.codigo)} · ${escapeHTML(item.tipo)}</p>
            </div>
            <span class="badge ok">${escapeHTML(item.estado)}</span>
          </article>
        `).join('')}
      </div>

      ${renderBackButton()}
    </section>
  `;
}

/* =========================================================
   BLOQUE 11. RENDER MENSAJES
   ========================================================= */

function renderMensajes() {
  return `
    <section>
      <h2 class="section-title">Mensajes</h2>
      <p class="section-note">Avisos institucionales y mensajes recibidos.</p>

      <div class="list">
        ${datosDemo.mensajes.map((item) => `
          <article class="info-card">
            <h3 class="info-title">${escapeHTML(item.titulo)}</h3>
            <p class="info-meta">${escapeHTML(item.codigo)} · ${escapeHTML(item.estado)}</p>
            <div class="badge-row">
              <span class="badge warn">Aviso</span>
            </div>
            <p class="info-meta">${escapeHTML(item.texto)}</p>
          </article>
        `).join('')}
      </div>

      ${renderBackButton()}
    </section>
  `;
}

/* =========================================================
   BLOQUE 12. RENDER PERFIL
   ========================================================= */

function renderPerfil() {
  return `
    <section>
      <h2 class="section-title">Perfil</h2>
      <p class="section-note">Datos principales del usuario.</p>

      <article class="info-card">
        <h3 class="info-title">${escapeHTML(appState.usuario.nombre)}</h3>
        <p class="info-meta">Código: ${escapeHTML(appState.usuario.codigo)}</p>
        <p class="info-meta">Rol: ${escapeHTML(appState.usuario.rol)}</p>
        <p class="info-meta">Municipio: ${escapeHTML(appState.usuario.municipio)}</p>
      </article>

      ${renderBackButton()}
    </section>
  `;
}

/* =========================================================
   BLOQUE 13. EVENTOS
   ========================================================= */

function bindEventos() {
  document.querySelectorAll('[data-view]').forEach((el) => {
    el.addEventListener('click', function () {
      const vista = el.getAttribute('data-view');

      if (vista) {
        setVista(vista);
      }
    });
  });

  document.querySelectorAll('[data-action="refresh"]').forEach((el) => {
    el.addEventListener('click', function () {
      renderApp();
    });
  });
}

/* =========================================================
   BLOQUE 14. INICIALIZACIÓN
   ========================================================= */

function inicializarApp() {
  const memberId = obtenerParametroURL('memberId');

  if (memberId) {
    appState.usuario.memberId = memberId;
    appState.usuario.codigo = 'Sesión recibida';
  }

  renderApp();
}

document.addEventListener('DOMContentLoaded', function () {
  inicializarApp();
});
