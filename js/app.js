/*
MORENA QRO Capacitación
Archivo: js/app.js
Versión: v1.8.2
Alcance: lógica base de navegación PWA usuario
*/

/* =========================================================
   BLOQUE 01. CONFIGURACIÓN
   ========================================================= */

const APP_VERSION = 'v1.8.2';
const MOR_API_USUARIO = 'https://www.scad.mx/_functions/morUsuario';
const MOR_API_DOCUMENTOS = 'https://www.scad.mx/_functions/morDocumentos';
const MOR_API_ACTIVIDADES = 'https://www.scad.mx/_functions/morActividades';
const MOR_API_MULTIMEDIA = 'https://www.scad.mx/_functions/morMultimedia';

const APP_CONFIG = {
  nombre: 'MORENA QRO',
  subtitulo: 'Capacitación · Querétaro',
  versionLabel: 'MORENA QRO Capacitación · v1.8.2'
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
  },
documentos: [],
documentosCargando: false,
documentosError: '',
actividades: [],
actividadesCargando: false,
actividadesError: '',
multimedia: [],
multimediaCargando: false,
multimediaError: '',
multimediaActualId: '',
multimediaModal: '',
multimediaBusqueda: '',
multimediaCategoria: 'Todos',
multimediaTipo: ''
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

async function cargarUsuarioPwa(memberId) {
  try {
    const url = `${MOR_API_USUARIO}?memberId=${encodeURIComponent(memberId)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok || !data.usuario) {
      appState.usuario.codigo = data.codigo || 'Usuario no validado';
      renderApp();
      return;
    }

    const usuario = data.usuario;

    appState.usuario.memberId = usuario.memberId || memberId;
    appState.usuario.nombre = usuario.nombreCompleto || usuario.nombre || 'Usuario MORENA';
    appState.usuario.codigo = usuario.codigoControl || 'USU';
    appState.usuario.rol = usuario.rolesApp || 'USU';
    appState.usuario.municipio = usuario.municipio || 'Querétaro';
    appState.usuario.avatarUrl = usuario.avatarUrl || '';

    renderApp();

  } catch (error) {
    console.error('Error al cargar usuario PWA:', error);

    appState.usuario.codigo = 'Error de conexión';
    renderApp();
  }
}

async function cargarDocumentosPwa(memberId) {
  try {
    appState.documentosCargando = true;
    appState.documentosError = '';
    renderApp();

    const url = `${MOR_API_DOCUMENTOS}?memberId=${encodeURIComponent(memberId)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      appState.documentos = [];
      appState.documentosError = data.codigo || 'No fue posible cargar documentos.';
      appState.documentosCargando = false;
      renderApp();
      return;
    }

    appState.documentos = Array.isArray(data.documentos) ? data.documentos : [];
    appState.documentosCargando = false;
    renderApp();

  } catch (error) {
    console.error('Error al cargar documentos PWA:', error);

    appState.documentos = [];
    appState.documentosError = 'Error de conexión.';
    appState.documentosCargando = false;
    renderApp();
  }
}

async function cargarActividadesPwa(memberId) {
  try {
    appState.actividadesCargando = true;
    appState.actividadesError = '';
    renderApp();

    const url = `${MOR_API_ACTIVIDADES}?memberId=${encodeURIComponent(memberId)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      appState.actividades = [];
      appState.actividadesError = data.codigo || 'No fue posible cargar actividades.';
      appState.actividadesCargando = false;
      renderApp();
      return;
    }

    appState.actividades = Array.isArray(data.actividades) ? data.actividades : [];
    appState.actividadesCargando = false;
    renderApp();

  } catch (error) {
    console.error('Error al cargar actividades PWA:', error);

    appState.actividades = [];
    appState.actividadesError = 'Error de conexión.';
    appState.actividadesCargando = false;
    renderApp();
  }
}

async function cargarMultimediaPwa(memberId) {
  try {
    appState.multimediaCargando = true;
    appState.multimediaError = '';
    renderApp();

    const url = `${MOR_API_MULTIMEDIA}?memberId=${encodeURIComponent(memberId)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      appState.multimedia = [];
      appState.multimediaError = data.codigo || 'No fue posible cargar multimedia.';
      appState.multimediaCargando = false;
      renderApp();
      return;
    }

    appState.multimedia = Array.isArray(data.multimedia) ? data.multimedia : [];
    appState.multimediaCargando = false;

    const destacado = appState.multimedia.find((item) => item.destacadoInicio) || appState.multimedia[0];

    if (destacado && !appState.multimediaActualId) {
      appState.multimediaActualId = destacado.id;
    }

    renderApp();

  } catch (error) {
    console.error('Error al cargar multimedia PWA:', error);

    appState.multimedia = [];
    appState.multimediaError = 'Error de conexión.';
    appState.multimediaCargando = false;
    renderApp();
  }
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
  const contenido = renderListaDocumentos();

  return `
    <section>
      <h2 class="section-title">Documentos</h2>
      <p class="section-note">Biblioteca disponible para consulta.</p>

      ${contenido}

      ${renderBackButton()}
    </section>
  `;
}

function renderListaDocumentos() {
  if (appState.documentosCargando) {
    return `
      <article class="info-card">
        <h3 class="info-title">Cargando documentos</h3>
        <p class="info-meta">Consulta en proceso.</p>
      </article>
    `;
  }

  if (appState.documentosError) {
    return `
      <article class="info-card">
        <h3 class="info-title">Documentos no disponibles</h3>
        <p class="info-meta">${escapeHTML(appState.documentosError)}</p>
      </article>
    `;
  }

  if (!appState.documentos.length) {
    return `
      <article class="info-card">
        <h3 class="info-title">Sin documentos disponibles</h3>
        <p class="info-meta">No hay documentos asignados para tu perfil.</p>
      </article>
    `;
  }

  return `
    <div class="list">
      ${appState.documentos.map((item) => `
        <article class="list-row">
          <div>
            <p class="list-title">${escapeHTML(item.titulo)}</p>
            <p class="list-meta">
              ${escapeHTML(item.codigoControl || 'DOC')} · ${escapeHTML(item.tipoDocumento || 'Documento')}
            </p>
          </div>
          ${item.urlDocumento ? `
            <a class="badge ok" href="${escapeHTML(item.urlDocumento)}" target="_blank" rel="noopener">
              Abrir
            </a>
          ` : `
            <span class="badge">Sin enlace</span>
          `}
        </article>
      `).join('')}
    </div>
  `;
}

/* =========================================================
   BLOQUE 09. RENDER ACTIVIDADES
   ========================================================= */

function renderActividades() {
  const contenido = renderListaActividades();

  return `
    <section>
      <h2 class="section-title">Actividades</h2>
      <p class="section-note">Actividades de capacitación disponibles.</p>

      ${contenido}

      ${renderBackButton()}
    </section>
  `;
}

function renderListaActividades() {
  if (appState.actividadesCargando) {
    return `
      <article class="info-card">
        <h3 class="info-title">Cargando actividades</h3>
        <p class="info-meta">Consulta en proceso.</p>
      </article>
    `;
  }

  if (appState.actividadesError) {
    return `
      <article class="info-card">
        <h3 class="info-title">Actividades no disponibles</h3>
        <p class="info-meta">${escapeHTML(appState.actividadesError)}</p>
      </article>
    `;
  }

  if (!appState.actividades.length) {
    return `
      <article class="info-card">
        <h3 class="info-title">Sin actividades disponibles</h3>
        <p class="info-meta">No hay actividades asignadas para tu perfil.</p>
      </article>
    `;
  }

  return `
    <div class="list">
      ${appState.actividades.map((item) => `
        <article class="list-row">
          <div>
            <p class="list-title">${escapeHTML(item.titulo)}</p>
            <p class="list-meta">
              ${escapeHTML(item.codigoControl || 'ACT')} · ${escapeHTML(item.tipoActividad || item.modalidad || 'Actividad')}
            </p>
            <p class="list-meta">
              ${escapeHTML(formatearFechaActividad(item.fechaActividad))}${item.horaActividad ? ` · ${escapeHTML(item.horaActividad)}` : ''}
            </p>
            ${item.lugar ? `<p class="list-meta">${escapeHTML(item.lugar)}</p>` : ''}
          </div>
${item.urlActividad ? `
  <a class="badge ok" href="${escapeHTML(item.urlActividad)}" target="_blank" rel="noopener">
    Abrir
  </a>
` : ''}
        </article>
      `).join('')}
    </div>
  `;
}

function formatearFechaActividad(valor) {
  if (!valor) {
    return 'Fecha pendiente';
  }

  const fecha = new Date(valor);

  if (isNaN(fecha.getTime())) {
    return 'Fecha pendiente';
  }

  return fecha.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/* =========================================================
   BLOQUE 10. RENDER MULTIMEDIA
   ========================================================= */

function renderMultimedia() {
  return `
    <section>
      <h2 class="section-title">Multimedia</h2>
      <p class="section-note">Videos, cápsulas y recursos visuales de capacitación.</p>

      ${renderMultimediaContenido()}

      ${renderBackButton()}

      ${renderModalMultimedia()}
    </section>
  `;
}

function renderMultimediaContenido() {
  if (appState.multimediaCargando) {
    return `
      <article class="info-card">
        <h3 class="info-title">Cargando multimedia</h3>
        <p class="info-meta">Consulta en proceso.</p>
      </article>
    `;
  }

  if (appState.multimediaError) {
    return `
      <article class="info-card">
        <h3 class="info-title">Multimedia no disponible</h3>
        <p class="info-meta">${escapeHTML(appState.multimediaError)}</p>
      </article>
    `;
  }

  if (!appState.multimedia.length) {
    return `
      <article class="info-card">
        <h3 class="info-title">Sin multimedia disponible</h3>
        <p class="info-meta">No hay recursos multimedia asignados para tu perfil.</p>
      </article>
    `;
  }

  const actual = obtenerMultimediaActual();

  return `
    <article class="media-hero">
      <div class="media-hero-content">
        <span class="media-eyebrow">Recurso destacado</span>

        <div class="media-visual">
          ${actual.urlVistaPrevia ? `
            <img src="${escapeHTML(actual.urlVistaPrevia)}" alt="${escapeHTML(actual.titulo)}" />
          ` : `
            <span>${escapeHTML(iconoMultimedia(actual.tipoMultimedia))}</span>
          `}
        </div>

        <h3>${escapeHTML(actual.titulo)}</h3>

        <p>${escapeHTML(actual.descripcion || 'Recurso multimedia de capacitación.')}</p>

        <div class="media-meta">
          ${escapeHTML(actual.codigoControl || 'MUL')} · ${escapeHTML(actual.tipoMultimedia || 'Multimedia')} · ${escapeHTML(actual.categoria || 'General')}
        </div>

<div class="media-actions ${actual.urlEmbed ? '' : 'single'}">
  ${actual.urlEmbed ? `
    <button class="btn btn-primary" type="button" data-action="multimedia-ver" data-id="${escapeHTML(actual.id)}">
      Ver contenido
    </button>

    <button class="btn btn-secondary" type="button" data-action="multimedia-info" data-id="${escapeHTML(actual.id)}">
      Información
    </button>
  ` : `
    <button class="btn btn-secondary" type="button" data-action="multimedia-info" data-id="${escapeHTML(actual.id)}">
      Información
    </button>
  `}
</div>
      </div>
    </article>

    <div class="media-action-grid">
      <button class="media-action-card" type="button" data-action="multimedia-buscar">
        <strong>Buscar contenido</strong>
        <span>Explora por categoría, tipo o palabra clave.</span>
      </button>

      <button class="media-action-card" type="button" data-action="multimedia-info" data-id="${escapeHTML(actual.id)}">
        <strong>Detalle del recurso</strong>
        <span>Consulta descripción, código y datos del contenido.</span>
      </button>
    </div>

    <section class="media-section-card">
      <div class="media-section-head">
        <h3>Para ti</h3>
        <button type="button" data-action="multimedia-buscar">Ver más</button>
      </div>

      <div class="media-mini-grid">
        ${appState.multimedia.slice(0, 3).map((item) => renderMiniMultimedia(item)).join('')}
      </div>
    </section>
  `;
}

function renderMiniMultimedia(item) {
  return `
    <article class="media-mini-card">
      <div class="media-mini-icon">${escapeHTML(iconoMultimedia(item.tipoMultimedia))}</div>

      <div>
        <p class="media-mini-title">${escapeHTML(item.titulo)}</p>
        <p class="media-mini-meta">
          ${escapeHTML(item.codigoControl || 'MUL')} · ${escapeHTML(item.tipoMultimedia || 'Multimedia')}
        </p>
      </div>

      <button class="media-pill" type="button" data-action="multimedia-seleccionar" data-id="${escapeHTML(item.id)}">
        Ver
      </button>
    </article>
  `;
}

function renderModalMultimedia() {
  if (!appState.multimediaModal) {
    return '';
  }

  if (appState.multimediaModal === 'ver') {
    return renderModalVerMultimedia();
  }

  if (appState.multimediaModal === 'info') {
    return renderModalInfoMultimedia();
  }

  if (appState.multimediaModal === 'buscar') {
    return renderModalBuscarMultimedia();
  }

  return '';
}

function renderModalVerMultimedia() {
  const item = obtenerMultimediaActual();

  if (!item.urlEmbed) {
    return renderModalInfoMultimedia();
  }

  return `
    <div class="media-overlay open">
      <section class="media-modal media-modal-player">
        <div class="media-modal-head">
          <h3>${escapeHTML(item.titulo || 'Multimedia')}</h3>
          <button class="media-close" type="button" data-action="multimedia-cerrar">×</button>
        </div>

        <div class="media-player">
          <iframe
            src="${escapeHTML(item.urlEmbed)}"
            title="${escapeHTML(item.titulo || 'Contenido multimedia')}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>

        <div class="media-player-meta">
          <strong>${escapeHTML(item.codigoControl || 'MUL')}</strong>
          <span>${escapeHTML(item.tipoMultimedia || 'Multimedia')} · ${escapeHTML(item.categoria || 'General')}</span>
        </div>

        <button class="btn btn-secondary media-full-btn" type="button" data-action="multimedia-info" data-id="${escapeHTML(item.id)}">
          Información
        </button>
      </section>
    </div>
  `;
}

function renderModalInfoMultimedia() {
  const item = obtenerMultimediaActual();

  return `
    <div class="media-overlay open">
      <section class="media-modal">
        <div class="media-modal-head">
          <h3>Información del recurso</h3>
          <button class="media-close" type="button" data-action="multimedia-cerrar">×</button>
        </div>

        ${renderDetalleMultimedia('Título', item.titulo)}
        ${renderDetalleMultimedia('Código', item.codigoControl || 'MUL')}
        ${renderDetalleMultimedia('Tipo', item.tipoMultimedia || 'Multimedia')}
        ${renderDetalleMultimedia('Categoría', item.categoria || 'General')}
        ${renderDetalleMultimedia('Descripción', item.descripcion || 'Sin descripción')}
      </section>
    </div>
  `;
}

function renderModalBuscarMultimedia() {
  const categorias = obtenerCategoriasMultimedia();
  const filtrados = filtrarMultimedia();

  return `
    <div class="media-overlay open">
      <section class="media-modal">
        <div class="media-modal-head">
          <h3>Buscar contenido</h3>
          <button class="media-close" type="button" data-action="multimedia-cerrar">×</button>
        </div>

        <div class="media-search-box">
          <input
            class="media-input"
            type="search"
            placeholder="Buscar por título o descripción"
            value="${escapeHTML(appState.multimediaBusqueda)}"
            data-input="multimedia-busqueda"
          />

          <div class="media-chips">
            ${categorias.map((cat) => `
              <button
                class="media-chip ${cat === appState.multimediaCategoria ? 'active' : ''}"
                type="button"
                data-action="multimedia-categoria"
                data-categoria="${escapeHTML(cat)}"
              >
                ${escapeHTML(cat)}
              </button>
            `).join('')}
          </div>

          <select class="media-select" data-input="multimedia-tipo">
            <option value="" ${!appState.multimediaTipo ? 'selected' : ''}>Todos los tipos</option>
            <option value="Video" ${appState.multimediaTipo === 'Video' ? 'selected' : ''}>Video</option>
            <option value="Audio" ${appState.multimediaTipo === 'Audio' ? 'selected' : ''}>Audio</option>
            <option value="Infografía" ${appState.multimediaTipo === 'Infografía' ? 'selected' : ''}>Infografía</option>
            <option value="Enlace" ${appState.multimediaTipo === 'Enlace' ? 'selected' : ''}>Enlace</option>
          </select>

          <div class="media-result-list">
            ${filtrados.length ? filtrados.map((item) => renderMiniMultimedia(item)).join('') : `
              <div class="media-empty">No se encontraron recursos con esos criterios.</div>
            `}
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderDetalleMultimedia(label, value) {
  return `
    <div class="media-detail-row">
      <p class="media-detail-label">${escapeHTML(label)}</p>
      <p class="media-detail-value">${escapeHTML(value)}</p>
    </div>
  `;
}

function obtenerMultimediaActual() {
  return appState.multimedia.find((item) => item.id === appState.multimediaActualId) || appState.multimedia[0] || {};
}

function obtenerCategoriasMultimedia() {
  const categorias = appState.multimedia
    .map((item) => item.categoria)
    .filter(Boolean);

  return ['Todos', ...Array.from(new Set(categorias))];
}

function filtrarMultimedia() {
  const q = normalizarTexto(appState.multimediaBusqueda);
  const categoria = appState.multimediaCategoria;
  const tipo = appState.multimediaTipo;

  return appState.multimedia.filter((item) => {
    const coincideCategoria = categoria === 'Todos' || item.categoria === categoria;
    const coincideTipo = !tipo || item.tipoMultimedia === tipo;

    const texto = normalizarTexto([
      item.titulo,
      item.descripcion,
      item.codigoControl,
      item.categoria,
      item.tipoMultimedia
    ].filter(Boolean).join(' '));

    const coincideTexto = !q || texto.includes(q);

    return coincideCategoria && coincideTipo && coincideTexto;
  });
}

function iconoMultimedia(tipo) {
  const raw = String(tipo || '').toLowerCase();

  if (raw.includes('video')) return '▶';
  if (raw.includes('audio')) return '♪';
  if (raw.includes('info')) return '■';

  return '↗';
}

function normalizarTexto(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
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

    document.querySelectorAll('[data-action^="multimedia"]').forEach((el) => {
    el.addEventListener('click', function () {
      const action = el.getAttribute('data-action');
      const id = el.getAttribute('data-id') || '';

      if (action === 'multimedia-ver') {
        verMultimedia(id);
      }

      if (action === 'multimedia-info') {
        if (id) {
          appState.multimediaActualId = id;
        }

        appState.multimediaModal = 'info';
        renderApp();
      }

      if (action === 'multimedia-buscar') {
        appState.multimediaModal = 'buscar';
        renderApp();
      }

      if (action === 'multimedia-cerrar') {
        appState.multimediaModal = '';
        renderApp();
      }

      if (action === 'multimedia-seleccionar') {
        appState.multimediaActualId = id;
        appState.multimediaModal = '';
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (action === 'multimedia-categoria') {
        appState.multimediaCategoria = el.getAttribute('data-categoria') || 'Todos';
        renderApp();
      }
    });
  });

  document.querySelectorAll('[data-input="multimedia-busqueda"]').forEach((el) => {
    el.addEventListener('input', function () {
      appState.multimediaBusqueda = el.value || '';
      renderApp();
    });
  });

  document.querySelectorAll('[data-input="multimedia-tipo"]').forEach((el) => {
    el.addEventListener('change', function () {
      appState.multimediaTipo = el.value || '';
      renderApp();
    });
  }); 
}

function verMultimedia(id) {
  const item = appState.multimedia.find((media) => media.id === id);

  if (!item) {
    return;
  }

  appState.multimediaActualId = id;

  if (!item.urlEmbed) {
    appState.multimediaModal = 'info';
    renderApp();
    return;
  }

  appState.multimediaModal = 'ver';
  renderApp();
}

/* =========================================================
   BLOQUE 14. INICIALIZACIÓN
   ========================================================= */

async function inicializarApp() {
  const memberId = obtenerParametroURL('memberId');

  if (memberId) {
    appState.usuario.memberId = memberId;
    appState.usuario.codigo = 'Sesión recibida';
  }

  renderApp();

if (memberId) {
await cargarUsuarioPwa(memberId);
await cargarDocumentosPwa(memberId);
await cargarActividadesPwa(memberId);
await cargarMultimediaPwa(memberId);
}
}

document.addEventListener('DOMContentLoaded', inicializarApp);
