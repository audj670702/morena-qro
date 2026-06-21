/*
MORENA QRO Capacitación
Archivo: js/app.js
Versión: v1.10.2.44
Alcance: lógica base de navegación PWA usuario
*/

/* =========================================================
   BLOQUE 01. CONFIGURACIÓN
   ========================================================= */

const APP_VERSION = 'v1.10.2.44';
const MOR_API_USUARIO = 'https://www.scad.mx/_functions/morUsuario';
const MOR_API_DOCUMENTOS = 'https://www.scad.mx/_functions/morDocumentos';
const MOR_API_MULTIMEDIA = 'https://www.scad.mx/_functions/morMultimedia';
const MOR_API_AVISOS = 'https://www.scad.mx/_functions/morAvisosSistema';
const MOR_API_PENDIENTES = 'https://www.scad.mx/_functions/morMensajesPendientes';
const MOR_API_CONVERSACIONES = 'https://www.scad.mx/_functions/morConversaciones';
const MOR_API_CONTACTOS_BUSCAR = 'https://www.scad.mx/_functions/morContactosBuscar';
const MOR_API_CONTACTOS_REGULARES = 'https://www.scad.mx/_functions/morContactosRegulares';
const MOR_API_CONTACTO_AGREGAR = 'https://www.scad.mx/_functions/morContactoAgregar';
const MOR_API_CONTACTO_ELIMINAR_REGULAR = 'https://www.scad.mx/_functions/morContactoEliminarRegular';
const MOR_API_CONTACTO_ALIAS = 'https://www.scad.mx/_functions/morContactoAlias';
const MOR_API_CONVERSACION_ABRIR = 'https://www.scad.mx/_functions/morConversacionAbrir';
const MOR_API_CONVERSACION_MENSAJES = 'https://www.scad.mx/_functions/morConversacionMensajes';
const MOR_API_MENSAJE_ENVIAR = 'https://www.scad.mx/_functions/morMensajeEnviar';
const MOR_PANEL_ADM_URL = 'https://www.scad.mx/mor-panel-adm';
const MOR_MIS_ACTIVIDADES_URL = 'https://www.scad.mx/mor-mis-actividades';
const MOR_ACCESS_URL = 'https://www.scad.mx/mor-acceso';
const APP_LOGO_URL = './assets/Logo_Mor.png';
const SCAD_LOGO_URL = './assets/icon-192.png';
const MORENA_FACEBOOK_URL = 'https://www.facebook.com/share/1A7utqCu8i/';
const IOS_TUTORIAL_URL = './assets/iphone-install.mp4';

const USER_AGENT = navigator.userAgent || '';
const IS_IOS = /iPad|iPhone|iPod/.test(USER_AGENT) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IS_ANDROID = /Android/i.test(USER_AGENT);
const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(USER_AGENT);
const IS_STANDALONE =
  (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
  window.navigator.standalone === true;

const APP_CONFIG = {
  nombre: 'MORENA QRO',
  subtitulo: 'Capacitación',
  versionLabel: APP_VERSION
};

/* =========================================================
   BLOQUE 02. ESTADO GLOBAL
   ========================================================= */

const appState = {
  vistaActual: 'inicio',
usuario: {
    nombre: 'Usuario MORENA',
    alias: '',
    codigo: 'USU-0000',
    rol: 'USU',
    perfilPartido: '',
    municipio: 'Querétaro',
    email: '',
    activo: false,
    accesoApp: false,
    avatarUrl: ''
  },
   
documentos: [],
documentosCargando: false,
documentosError: '',
multimedia: [],
multimediaCargando: false,
multimediaError: '',
multimediaActualId: '',
multimediaModal: '',
multimediaBusqueda: '',
multimediaCategoria: 'Todos',
multimediaTipo: '',
facebookModal: false,
avisos: [],
avisosCanal: null,
avisosCargando: false,
avisosError: '',
mensajesPendientesTotal: 0,
mensajesPendientes: [],
conversaciones: [],
conversacionesCargando: false,
conversacionesError: '',
contactosBusqueda: '',
contactosBusquedaTimer: null,
contactosResultados: [],
contactosCargando: false,
contactosError: '',
contactosRegulares: [],
contactosRegularesCargando: false,
contactosRegularesError: '',
contactoAccionEnCurso: false,
chatConversacion: null,
chatContacto: null,
chatMensajes: [],
chatCargando: false,
chatEnviando: false,
chatError: '',
chatTexto: '',
mensajesBusquedaAbierta: false,
mensajesPendientesAbierto: false,
contactosModo: 'regulares',
mensajesSyncTimer: null,
mensajesSyncEnCurso: false,
instalacion: {
  estado: 'web',
  instalable: false,
  instalando: false,
  mensaje: 'Web'
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
      appState.usuario.alias = usuario.alias || usuario.nombreCorto || '';
    appState.usuario.perfilPartido = usuario.perfilPartido || usuario.perfil || usuario.rolPartido || usuario.rolesApp || '';
    appState.usuario.email = usuario.email || usuario.loginEmail || usuario.correo || '';
    appState.usuario.activo = usuario.activo === true || String(usuario.activo).toLowerCase() === 'true';
    appState.usuario.accesoApp = usuario.accesoApp === true || usuario.accesoActivo === true || String(usuario.accesoApp || usuario.accesoActivo).toLowerCase() === 'true';
    appState.usuario.avatarUrl = usuario.avatarUrl || usuario.fotoPerfil || '';

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

async function cargarMensajesPwa(memberId) {
await Promise.all([
  cargarAvisosPwa(memberId),
  cargarPendientesMensajesPwa(memberId),
  cargarConversacionesPwa(memberId),
  cargarContactosRegularesPwa(memberId)
]);
}

async function cargarAvisosPwa(memberId) {
  try {
    appState.avisosCargando = true;
    appState.avisosError = '';
    renderApp();

    const url = `${MOR_API_AVISOS}?memberId=${encodeURIComponent(memberId)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      appState.avisos = [];
      appState.avisosCanal = null;
      appState.avisosError = data.codigo || 'No fue posible cargar avisos.';
      appState.avisosCargando = false;
      renderApp();
      return;
    }

    appState.avisos = Array.isArray(data.avisos) ? data.avisos : [];
    appState.avisosCanal = data.canal || null;
    appState.avisosCargando = false;
    renderApp();

  } catch (error) {
    console.error('Error al cargar avisos:', error);
    appState.avisos = [];
    appState.avisosError = 'Error de conexión.';
    appState.avisosCargando = false;
    renderApp();
  }
}

async function cargarPendientesMensajesPwa(memberId) {
  try {
    const url = `${MOR_API_PENDIENTES}?memberId=${encodeURIComponent(memberId)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      appState.mensajesPendientesTotal = 0;
      appState.mensajesPendientes = [];
      renderApp();
      return;
    }

    const pendientesRaw =
      Array.isArray(data.pendientes) ? data.pendientes :
      Array.isArray(data.pending) ? data.pending :
      Array.isArray(data.contacts) ? data.contacts :
      Array.isArray(data.items) ? data.items :
      Array.isArray(data.conversaciones) ? data.conversaciones :
      [];

    appState.mensajesPendientes = pendientesRaw.map((item) => ({
      ...item,
      conversacionId:
        item.conversacionId ||
        item.idConversacion ||
        item.conversationId ||
        item.id ||
        item._id ||
        '',

      contactoMemberId:
        item.contactoMemberId ||
        item.contactMemberId ||
        item.remitenteMemberId ||
        item.senderMemberId ||
        item.memberId ||
        item.contacto?.memberId ||
        '',

      nombre:
        item.nombre ||
        item.nombreMostrar ||
        item.displayName ||
        item.nombreCompleto ||
        item.contacto?.nombreCompleto ||
        item.contacto?.nombre ||
        item.remitenteNombre ||
        item.asunto ||
        item.nombreCanal ||
        'Pendiente',

      ultimoMensaje:
        item.ultimoMensaje ||
        item.lastMessage ||
        item.mensaje ||
        item.message ||
        item.body ||
        item.text ||
        '',

      count:
        Number(item.count || item.pendientes || item.total || 1)
    }));

    appState.mensajesPendientesTotal =
      Number(data.total || 0) ||
      appState.mensajesPendientes.reduce((sum, item) => sum + Number(item.count || 1), 0);

    renderApp();

  } catch (error) {
    console.error('Error al cargar pendientes:', error);
    appState.mensajesPendientesTotal = 0;
    appState.mensajesPendientes = [];
    renderApp();
  }
}

async function cargarConversacionesPwa(memberId) {
  try {
    appState.conversacionesCargando = true;
    appState.conversacionesError = '';
    renderApp();

    const url = `${MOR_API_CONVERSACIONES}?memberId=${encodeURIComponent(memberId)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      appState.conversaciones = [];
      appState.conversacionesError = data.codigo || 'No fue posible cargar conversaciones.';
      appState.conversacionesCargando = false;
      renderApp();
      return;
    }

    appState.conversaciones = Array.isArray(data.conversaciones) ? data.conversaciones : [];
    appState.conversacionesCargando = false;
    renderApp();

  } catch (error) {
    console.error('Error al cargar conversaciones:', error);
    appState.conversaciones = [];
    appState.conversacionesError = 'Error de conexión.';
    appState.conversacionesCargando = false;
    renderApp();
  }
}

async function buscarContactosPwa() {
  const memberId = appState.usuario.memberId || '';
  const q = appState.contactosBusqueda.trim();

  if (!memberId || !q) {
    appState.contactosResultados = [];
    appState.contactosError = '';
    renderApp();
    return;
  }

  try {
    appState.contactosCargando = true;
    appState.contactosError = '';
    renderApp();

    const url = `${MOR_API_CONTACTOS_BUSCAR}?memberId=${encodeURIComponent(memberId)}&q=${encodeURIComponent(q)}`;
    const response = await fetch(url);
    const data = await response.json();

    appState.contactosResultados = data.ok && Array.isArray(data.contactos) ? data.contactos : [];
    appState.contactosError = data.ok ? '' : (data.codigo || 'No fue posible buscar contactos.');
    appState.contactosCargando = false;
    renderApp();

  } catch (error) {
    console.error('Error al buscar contactos:', error);
    appState.contactosResultados = [];
    appState.contactosError = 'Error de conexión.';
    appState.contactosCargando = false;
    renderApp();
  }
}

async function cargarContactosRegularesPwa(memberId) {
  if (!memberId) {
    appState.contactosRegulares = [];
    appState.contactosRegularesError = '';
    return;
  }

  try {
    appState.contactosRegularesCargando = true;
    appState.contactosRegularesError = '';
    renderApp();

    const url = `${MOR_API_CONTACTOS_REGULARES}?memberId=${encodeURIComponent(memberId)}`;
    const response = await fetch(url);
    const data = await response.json();

    appState.contactosRegulares = data.ok && Array.isArray(data.contactos) ? data.contactos : [];
    appState.contactosRegularesError = data.ok ? '' : (data.codigo || data.mensaje || 'No fue posible cargar contactos regulares.');
    appState.contactosRegularesCargando = false;
    renderApp();

  } catch (error) {
    console.error('Error al cargar contactos regulares:', error);
    appState.contactosRegulares = [];
    appState.contactosRegularesError = 'Error de conexión.';
    appState.contactosRegularesCargando = false;
    renderApp();
  }
}

async function agregarContactoRegular(contactMemberId) {
  const memberId = appState.usuario.memberId || '';

  if (!memberId || !contactMemberId || appState.contactoAccionEnCurso) return;

  try {
    appState.contactoAccionEnCurso = true;
    renderApp();

    const response = await fetch(MOR_API_CONTACTO_AGREGAR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, contactMemberId })
    });

    const data = await response.json();

    if (!data.ok) {
      appState.chatError = data.mensaje || 'No fue posible agregar el contacto.';
    }

    await cargarContactosRegularesPwa(memberId);

  } catch (error) {
    console.error('Error al agregar contacto regular:', error);
    appState.chatError = 'Error de conexión al agregar contacto.';

  } finally {
    appState.contactoAccionEnCurso = false;
    renderApp();
  }
}

async function eliminarContactoRegular(contactMemberId) {
  const memberId = appState.usuario.memberId || '';

  if (!memberId || !contactMemberId || appState.contactoAccionEnCurso) return;

  const confirmar = window.confirm('¿Quitar este contacto de tus contactos regulares?');

  if (!confirmar) return;

  try {
    appState.contactoAccionEnCurso = true;
    renderApp();

    const response = await fetch(MOR_API_CONTACTO_ELIMINAR_REGULAR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, contactMemberId })
    });

    const data = await response.json();

    if (!data.ok) {
      appState.contactosRegularesError = data.mensaje || 'No fue posible quitar el contacto.';
    }

    await cargarContactosRegularesPwa(memberId);

  } catch (error) {
    console.error('Error al quitar contacto regular:', error);
    appState.contactosRegularesError = 'Error de conexión.';

  } finally {
    appState.contactoAccionEnCurso = false;
    renderApp();
  }
}

async function actualizarAliasContactoRegular(contactMemberId) {
  const memberId = appState.usuario.memberId || '';

  if (!memberId || !contactMemberId || appState.contactoAccionEnCurso) return;

  const contacto = appState.contactosRegulares.find((item) => {
    return obtenerContactIdDesdeContacto(item) === contactMemberId;
  });

  const aliasActual = contacto?.contactAlias || '';

  const nuevoAlias = window.prompt(
    'Alias para este contacto. Deja vacío para quitar alias.',
    aliasActual
  );

  if (nuevoAlias === null) return;

  try {
    appState.contactoAccionEnCurso = true;
    renderApp();

    const response = await fetch(MOR_API_CONTACTO_ALIAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId,
        contactMemberId,
        contactAlias: nuevoAlias.trim()
      })
    });

    const data = await response.json();

    if (!data.ok) {
      appState.contactosRegularesError = data.mensaje || 'No fue posible guardar el alias.';
    }

    await cargarContactosRegularesPwa(memberId);

  } catch (error) {
    console.error('Error al actualizar alias:', error);
    appState.contactosRegularesError = 'Error de conexión al guardar alias.';

  } finally {
    appState.contactoAccionEnCurso = false;
    renderApp();
  }
}

async function abrirChatContacto(contactoMemberId) {
  const memberId = appState.usuario.memberId || '';

  if (!memberId || !contactoMemberId) return;

  try {
    appState.chatCargando = true;
    appState.chatError = '';
    renderApp();

    const response = await fetch(MOR_API_CONVERSACION_ABRIR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, contactoMemberId })
    });

    const data = await response.json();

    if (!data.ok || !data.conversacion) {
      appState.chatError = data.mensaje || 'No fue posible abrir la conversación.';
      appState.chatCargando = false;
      renderApp();
      return;
    }

    appState.chatConversacion = data.conversacion;
    appState.chatContacto = data.conversacion.contacto || null;
    await cargarChatMensajes(data.conversacion.id);

  } catch (error) {
    console.error('Error al abrir chat:', error);
    appState.chatError = 'Error de conexión.';
    appState.chatCargando = false;
    renderApp();
  }
}

async function abrirChatConversacion(conversacionId) {
  const conv = appState.conversaciones.find((item) => item.id === conversacionId);

  if (!conv) return;

  appState.chatConversacion = conv;
  appState.chatContacto = conv.contacto || null;
  await cargarChatMensajes(conversacionId);
}

async function cargarChatMensajes(conversacionId, opciones = {}) {
  const memberId = appState.usuario.memberId || '';
  const silencioso = opciones.silencioso === true;

  if (!memberId || !conversacionId) return;

  try {
    if (!silencioso) {
      appState.chatCargando = true;
      appState.chatError = '';
      renderApp();
    }

    const url = `${MOR_API_CONVERSACION_MENSAJES}?memberId=${encodeURIComponent(memberId)}&conversacionId=${encodeURIComponent(conversacionId)}`;
    const response = await fetch(url);
    const data = await response.json();

    appState.chatMensajes = data.ok && Array.isArray(data.mensajes) ? data.mensajes : [];
    appState.chatError = data.ok ? '' : (data.mensaje || 'No fue posible cargar mensajes.');
    appState.chatCargando = false;

    await cargarPendientesMensajesPwa(memberId);

    renderApp();

  } catch (error) {
    console.error('Error al cargar chat:', error);
    appState.chatMensajes = [];
    appState.chatError = 'Error de conexión.';
    appState.chatCargando = false;
    renderApp();
  }
}

async function enviarMensajeChat() {
  const memberId = appState.usuario.memberId || '';
  const contactoMemberId = appState.chatContacto?.memberId || '';
  const conversacionId = appState.chatConversacion?.id || '';
  const mensaje = appState.chatTexto.trim();

  if (!memberId || !contactoMemberId || !mensaje || appState.chatEnviando) return;

  try {
    appState.chatEnviando = true;
    appState.chatError = '';
    renderApp();

    const response = await fetch(MOR_API_MENSAJE_ENVIAR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, contactoMemberId, conversacionId, mensaje })
    });

    const data = await response.json();

    if (!data.ok) {
      appState.chatError = data.mensaje || 'No fue posible enviar el mensaje.';
      appState.chatEnviando = false;
      renderApp();
      return;
    }

    appState.chatTexto = '';

    await cargarChatMensajes(conversacionId, { silencioso: true });
    await cargarConversacionesPwa(memberId);

    appState.chatEnviando = false;
    renderApp();

  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    appState.chatError = 'Error de conexión.';
    appState.chatEnviando = false;
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

  if (vista === 'mensajes') {
    iniciarSincronizacionMensajes();
  } else {
    detenerSincronizacionMensajes();
  }

  renderApp();
}

function iniciarSincronizacionMensajes() {
  detenerSincronizacionMensajes();

  appState.mensajesSyncTimer = window.setInterval(function () {
    sincronizarMensajesPwa();
  }, 12000);
}

function detenerSincronizacionMensajes() {
  if (appState.mensajesSyncTimer) {
    window.clearInterval(appState.mensajesSyncTimer);
    appState.mensajesSyncTimer = null;
  }

  appState.mensajesSyncEnCurso = false;
}

async function sincronizarMensajesPwa() {
  const memberId = appState.usuario.memberId || '';

  if (!memberId || appState.vistaActual !== 'mensajes') {
    detenerSincronizacionMensajes();
    return;
  }

  if (appState.mensajesSyncEnCurso) return;

  try {
    appState.mensajesSyncEnCurso = true;

    const conversacionId = appState.chatConversacion?.id || '';

    if (conversacionId) {
      await cargarChatMensajes(conversacionId, { silencioso: true });
      await cargarConversacionesPwa(memberId);
    } else {
      await cargarPendientesMensajesPwa(memberId);
      await cargarConversacionesPwa(memberId);
    }

  } catch (error) {
    console.error('Error al sincronizar mensajes:', error);
  } finally {
    appState.mensajesSyncEnCurso = false;
  }
}

async function actualizarDatosPwa() {
  const memberId = appState.usuario.memberId || obtenerParametroURL('memberId');

  if (!memberId) {
    renderApp();
    return;
  }

  if (appState.vistaActual === 'mensajes') {
    await cargarMensajesPwa(memberId);
    return;
  }

  await cargarUsuarioPwa(memberId);
  await cargarDocumentosPwa(memberId);
  await cargarMultimediaPwa(memberId);
  await cargarMensajesPwa(memberId);
}

function usuarioEsADM() {
  const roles = String(appState.usuario.rol || '')
    .toUpperCase()
    .split(/[,\n;|]/)
    .map((rol) => rol.trim())
    .filter(Boolean);

  return roles.includes('ADM');
}

function haySesionActiva() {
  return Boolean(appState.usuario.memberId);
}

function abrirPanelADM() {
  const memberId = appState.usuario.memberId || '';
  const url = `${MOR_PANEL_ADM_URL}?memberId=${encodeURIComponent(memberId)}`;
  window.location.href = url;
}

function abrirMisActividades() {
  const memberId = appState.usuario.memberId || '';
  const url = memberId
    ? `${MOR_MIS_ACTIVIDADES_URL}?memberId=${encodeURIComponent(memberId)}`
    : MOR_MIS_ACTIVIDADES_URL;

  window.location.href = url;
}

let deferredPrompt = null;
let instalacionPwaConfigurada = false;

function configurarInstalacionPwa() {
  if (instalacionPwaConfigurada) {
    return;
  }

  instalacionPwaConfigurada = true;

  actualizarEstadoInstalacionPwa();

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();

    deferredPrompt = event;

    if (IS_IOS || IS_STANDALONE) {
      return;
    }

    appState.instalacion.estado = 'instalable';
    appState.instalacion.instalable = true;
    appState.instalacion.instalando = false;
    appState.instalacion.mensaje = 'Instalar app';

    renderApp();
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;

    appState.instalacion.estado = 'instalada';
    appState.instalacion.instalable = false;
    appState.instalacion.instalando = false;
    appState.instalacion.mensaje = 'App instalada';

    renderApp();
  });
}

function actualizarEstadoInstalacionPwa() {
  if (IS_STANDALONE) {
    appState.instalacion.estado = 'instalada';
    appState.instalacion.instalable = false;
    appState.instalacion.instalando = false;
    appState.instalacion.mensaje = 'App instalada';
    return;
  }

  if (IS_IOS) {
    appState.instalacion.estado = 'ios';
    appState.instalacion.instalable = false;
    appState.instalacion.instalando = false;
    appState.instalacion.mensaje = 'Instalar iOS';
    return;
  }

  if (deferredPrompt) {
    appState.instalacion.estado = 'instalable';
    appState.instalacion.instalable = true;
    appState.instalacion.instalando = false;
    appState.instalacion.mensaje = 'Instalar app';
    return;
  }

  appState.instalacion.estado = 'web';
  appState.instalacion.instalable = false;
  appState.instalacion.instalando = false;
  appState.instalacion.mensaje = 'Web';
}

async function instalarPwa() {
  if (!deferredPrompt) {
    actualizarEstadoInstalacionPwa();
    renderApp();
    return;
  }

  appState.instalacion.instalando = true;
  appState.instalacion.mensaje = 'Instalando...';
  renderApp();

  try {
    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice && choice.outcome === 'accepted') {
      appState.instalacion.estado = 'instalando';
      appState.instalacion.instalable = false;
      appState.instalacion.instalando = true;
      appState.instalacion.mensaje = 'Instalando...';

      window.setTimeout(function () {
        if (!IS_IOS && !IS_STANDALONE) {
          appState.instalacion.estado = 'instalada';
          appState.instalacion.instalable = false;
          appState.instalacion.instalando = false;
          appState.instalacion.mensaje = 'App instalada';
          renderApp();
        }
      }, 60000);

    } else {
      appState.instalacion.estado = 'web';
      appState.instalacion.instalable = false;
      appState.instalacion.instalando = false;
      appState.instalacion.mensaje = 'Web';
    }

  } catch (error) {
    console.error('Error al instalar PWA:', error);

    appState.instalacion.estado = 'web';
    appState.instalacion.instalable = false;
    appState.instalacion.instalando = false;
    appState.instalacion.mensaje = 'Web';

  } finally {
    deferredPrompt = null;
    renderApp();
  }
}

function abrirTutorialIos() {
  window.location.href = IOS_TUTORIAL_URL;
}

function renderMensajesNavCard() {
  const pendientes = Number(appState.mensajesPendientesTotal || 0);

  return `
    <button class="nav-card" type="button" data-view="mensajes">
      <div class="nav-icon">✉</div>
      <p class="nav-title">Mensajes</p>
      <p class="nav-desc">Avisos recibidos</p>
      ${pendientes > 0 ? `
        <span class="badge warn nav-badge">${pendientes}</span>
      ` : ''}
    </button>
  `;
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
  return '';
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
      ${renderPoweredFooter()}
    </main>
  `;

  bindEventos();
}

function renderHeader() {
  const haySesion = Boolean(appState.usuario.memberId);

  return `
    <header class="app-header">
      <button
        class="topbar-session"
        type="button"
        ${haySesion ? 'data-action="logout-lite"' : 'disabled'}
        aria-label="${haySesion ? 'Cerrar sesión' : 'Iniciar sesión no disponible'}"
      >
        ${haySesion ? '⎋' : '↪'}
      </button>

      <img class="app-logo-img" src="${escapeHTML(APP_LOGO_URL)}" alt="MORENA QRO" />

<div class="topbar-actions">
  ${renderInstallControl()}

  ${appState.vistaActual !== 'inicio' ? `
    <button class="topbar-icon" type="button" data-view="inicio" aria-label="Inicio">
      ⌂
    </button>
  ` : ''}

  <button class="topbar-icon" type="button" data-action="refresh" aria-label="Actualizar">
    ↻
  </button>
</div>
    </header>
  `;
}

function renderInstallControl() {
  const instalacion = appState.instalacion || {};
  const estado = instalacion.estado || 'web';
  const mensaje = instalacion.mensaje || 'Web';

  if (estado === 'instalable') {
    return `
      <button class="install-pill install-action" type="button" data-action="instalar-pwa">
        ${escapeHTML(mensaje || 'Instalar app')}
      </button>
    `;
  }

  if (estado === 'ios') {
    return `
      <button class="install-pill install-action" type="button" data-action="tutorial-ios">
        ${escapeHTML(mensaje || 'Instalar iOS')}
      </button>
    `;
  }

  if (estado === 'instalando') {
    return `
      <span class="install-pill install-status">
        Instalando...
      </span>
    `;
  }

  if (estado === 'instalada') {
    return `
      <span class="install-pill install-status">
        App instalada
      </span>
    `;
  }

  return `
    <span class="install-pill install-status">
      Web
    </span>
  `;
}

function renderVista() {
  switch (appState.vistaActual) {
    case 'documentos':
      return renderDocumentos();

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
    <section class="home-screen">
      ${renderIdentityCard()}
      ${renderInicioContenidoDestacado()}

      <div class="nav-grid nav-list">
${renderModuloRow('🎓', 'Mi capacitación', 'perfil', 0)}
${renderModuloActionRow('📅', 'Mis Actividades', 'abrir-mis-actividades', 0)}
${renderModuloRow('📄', 'Documentos', 'documentos', appState.documentos.length)}
${renderModuloRow('💬', 'Mensajes', 'mensajes', appState.mensajesPendientesTotal)}
${renderModuloRow('▶️', 'Multimedia', 'multimedia', appState.multimedia.length)}
${renderModuloRow('👥', 'Grupos', 'perfil', 0)}
${usuarioEsADM() ? renderModuloADM() : ''}
      </div>

      ${renderModalFacebookInicio()}
    </section>
  `;
}

function renderIdentityCard() {
  const usuario = appState.usuario;
  const perfilPartido = usuario.perfilPartido || usuario.rol || 'Usuario';
  const codigoValidacion = generarCodigoValidacionUsuario();

  return `
    <article class="identity-card">
      <button class="identity-avatar" type="button" data-view="perfil" aria-label="Actualizar perfil">
        ${usuario.avatarUrl ? `
          <img src="${escapeHTML(usuario.avatarUrl)}" alt="${escapeHTML(usuario.nombre)}" />
        ` : `
          <span>${escapeHTML(obtenerInicialesUsuario(usuario.nombre))}</span>
        `}
        <small>✎</small>
      </button>

      <div class="identity-main">
        <h2>${escapeHTML(usuario.nombre)}</h2>
        <p>${escapeHTML(perfilPartido)}</p>
      </div>

      <div class="identity-tech">
        <span>${escapeHTML(codigoValidacion)}</span>
        <small>${escapeHTML(APP_VERSION)}</small>
      </div>
    </article>
  `;
}

function renderInicioContenidoDestacado() {
  const haySesion = Boolean(appState.usuario.memberId);

  if (!haySesion) {
    return renderAccesoSinSesion();
  }

  return `
    <section class="home-feature-grid">
      ${renderInicioBannerMultimedia()}
      ${renderInicioBannerFacebook()}
    </section>
  `;
}

function renderAccesoSinSesion() {
  return `
    <section class="home-access-login">
      <button class="home-access-login-btn" type="button" data-action="iniciar-sesion">
        Iniciar sesión
      </button>
    </section>
  `;
}

function renderInicioBannerMultimedia() {
  const item = obtenerMultimediaActual();
  const titulo = item.titulo || 'Multimedia';
  const detalle = item.descripcion || '';

  return `
    <button class="home-feature-card media-feature-card" type="button" data-action="multimedia-reciente">
      <div class="feature-visual">
        ${item.urlVistaPrevia ? `
          <img src="${escapeHTML(item.urlVistaPrevia)}" alt="${escapeHTML(titulo)}" />
        ` : `
          <span>${escapeHTML(iconoMultimedia(item.tipoMultimedia || 'Video'))}</span>
        `}

        <i class="feature-play">▶</i>

        <div class="feature-gradient">
          <div class="feature-copy">
            <strong>${escapeHTML(titulo)}</strong>
            ${detalle ? `<small>${escapeHTML(detalle)}</small>` : ''}
          </div>
        </div>
      </div>
    </button>
  `;
}

function renderInicioBannerFacebook() {
  const item = obtenerFacebookInicioActual();
  const titulo = item.titulo || 'Facebook';
  const detalle = item.descripcion || 'MORENA QRO';
  const urlContenido = item.urlContenido || item.urlMultimedia || '';
  const urlEmbed = construirEmbedFacebook(urlContenido);

  return `
    <button class="home-feature-card facebook-feature-card" type="button" data-action="facebook-modal-abrir">
      <div class="feature-visual fb-feature-visual ${urlEmbed ? 'has-fb-embed' : ''}">
        ${urlEmbed ? `
          <div class="fb-feature-embed-wrap">
            <iframe
              class="fb-feature-embed"
              src="${escapeHTML(urlEmbed)}"
              title="${escapeHTML(titulo)}"
              frameborder="0"
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        ` : `
          <span class="fb-feature-icon">f</span>
        `}

        <span class="fb-source-badge">f</span>

        <div class="feature-gradient">
          <div class="feature-copy">
            <strong>${escapeHTML(titulo)}</strong>
            ${detalle ? `<small>${escapeHTML(detalle)}</small>` : ''}
          </div>
        </div>
      </div>
    </button>
  `;
}

function renderModuloRow(icono, titulo, vista, contador) {
  const total = Number(contador || 0);
  const bloqueado = !haySesionActiva();

  return `
    <button
      class="nav-card nav-row ${bloqueado ? 'nav-locked' : ''}"
      type="button"
      ${bloqueado ? 'data-action="modulo-bloqueado"' : `data-view="${escapeHTML(vista)}"`}
    >
      <div class="nav-icon">${escapeHTML(icono)}</div>
      <p class="nav-title">${escapeHTML(titulo)}</p>
      ${total > 0 && !bloqueado ? `<span class="badge warn nav-badge">${total}</span>` : ''}
      ${bloqueado ? `<span class="nav-lock">🔒</span>` : `<span class="nav-chevron">›</span>`}
    </button>
  `;
}

function renderModuloActionRow(icono, titulo, action, contador) {
  const total = Number(contador || 0);
  const bloqueado = !haySesionActiva();

  return `
    <button
      class="nav-card nav-row ${bloqueado ? 'nav-locked' : ''}"
      type="button"
      data-action="${bloqueado ? 'modulo-bloqueado' : escapeHTML(action)}"
    >
      <div class="nav-icon">${escapeHTML(icono)}</div>
      <p class="nav-title">${escapeHTML(titulo)}</p>
      ${total > 0 && !bloqueado ? `<span class="badge warn nav-badge">${total}</span>` : ''}
      ${bloqueado ? `<span class="nav-lock">🔒</span>` : `<span class="nav-chevron">›</span>`}
    </button>
  `;
}

function renderModuloADM() {
  return `
    <button class="nav-card nav-row adm-row" type="button" data-action="abrir-panel-adm">
      <div class="nav-icon">⚙️</div>
      <p class="nav-title">Panel ADM</p>
      <span class="nav-chevron">›</span>
    </button>
  `;
}

function renderModalFacebookInicio() {
  if (!appState.facebookModal) {
    return '';
  }

  const item = obtenerFacebookInicioActual();
  const titulo = item.titulo || 'Publicación de Facebook';
  const urlContenido = item.urlContenido || item.urlMultimedia || MORENA_FACEBOOK_URL;
  const urlEmbed = construirEmbedFacebook(urlContenido);

  return `
    <div class="fb-modal-overlay open">
      <section class="fb-modal-card">
        <div class="fb-modal-head">
          <div>
            <h3>${escapeHTML(titulo)}</h3>
            <p>Publicación de Facebook</p>
          </div>

          <button class="fb-modal-close" type="button" data-action="facebook-modal-cerrar">
            ×
          </button>
        </div>

        <div class="fb-modal-frame">
          ${urlEmbed ? `
            <iframe
              src="${escapeHTML(urlEmbed)}"
              title="${escapeHTML(titulo)}"
              frameborder="0"
              scrolling="yes"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          ` : `
            <div class="fb-modal-empty">
              No fue posible cargar la vista previa.
            </div>
          `}
        </div>

        <div class="fb-modal-actions">
          <button class="btn btn-secondary" type="button" data-action="facebook-modal-cerrar">
            Cerrar
          </button>

          <button class="btn btn-primary" type="button" data-action="facebook-abrir">
            Abrir en Facebook
          </button>
        </div>
      </section>
    </div>
  `;
}

function renderPoweredFooter() {
  return `
    <footer class="powered-footer">
      <span>Powered by</span>
      <img src="${escapeHTML(SCAD_LOGO_URL)}" alt="SCaD" />
    </footer>
  `;
}

function generarCodigoValidacionUsuario() {
  const usuario = appState.usuario;

  const em = usuario.email ? 1 : 0;
  const mid = usuario.memberId ? 1 : 0;
  const a = usuario.activo ? 1 : 0;
  const pp = usuario.perfilPartido || usuario.rol ? 1 : 0;
  const aca = usuario.accesoApp ? 1 : 0;

  return `Em${em}MiD${mid}A${a}Pp${pp}AcA${aca}`;
}

function obtenerInicialesUsuario(nombre) {
  const partes = String(nombre || 'Usuario MORENA')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const iniciales = partes
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('');

  return iniciales || 'M';
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

function construirEmbedFacebook(url) {
  const link = String(url || '').trim();

  if (!link) {
    return '';
  }

  return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(link)}&show_text=true&width=500`;
}

function obtenerFacebookInicioActual() {
  const facebookItems = appState.multimedia.filter((item) => {
    const tipo = normalizarTexto(item.tipoFuente || item.tipoMultimedia);
    const estadoContenido = String(item.estadoContenido || '').toUpperCase();
    const publicado = !estadoContenido || estadoContenido === 'PUBLICADO';
    const esFacebook = tipo === 'facebook';

    return esFacebook && publicado;
  });

  const destacado = facebookItems.find((item) => item.mostrarEnInicio === true);

  return destacado || facebookItems[0] || {};
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
   BLOQUE 11. RENDER MENSAJES v1.10.2.28
   ========================================================= */

function renderMensajes() {
  const pendientes = Number(appState.mensajesPendientesTotal || 0);

  return `
    <section class="sms-screen">
      <div class="sms-title-bar">
        <div class="sms-title-main">
          <span class="sms-title-icon">💬</span>
          <h2>Mensajería</h2>
        </div>

        ${pendientes > 0 ? `
          <div class="sms-title-alert">
            <span>Mensajes nuevos</span>
            <b>${pendientes}</b>
          </div>
        ` : ''}
      </div>

${renderSmsPendientes()}
${renderBuscarContactos()}
${renderChat()}

      ${renderBackButton()}
    </section>
  `;
}

function renderSmsPendientes() {
  const pendientes = Array.isArray(appState.mensajesPendientes) ? appState.mensajesPendientes : [];
  const hayPendientes = pendientes.length > 0;

  if (!hayPendientes) {
    return '';
  }

  const abierto = appState.mensajesPendientesAbierto !== false;

  return `
    <article class="sms-card sms-pending-card">
      <button class="sms-pending-head-toggle ${hayPendientes ? 'has-pending' : ''}" type="button" data-action="sms-pendientes-toggle">
        <strong>Pendientes</strong>

        <span>
          ${hayPendientes ? '<small>Selecciona contacto</small>' : ''}
          <b>${abierto ? '▾' : '▸'}</b>
        </span>
      </button>

      ${hayPendientes && abierto ? `
        <div class="sms-pending-list">
          ${pendientes.map((item, index) => renderSmsPendienteItem(item, index)).join('')}
        </div>
      ` : ''}
    </article>
  `;
}

function renderSmsPendienteItem(item, index) {
  const tipo = obtenerTipoSmsItem(item);
  const nombre = obtenerNombreSmsItem(item);
  const count = Number(item.count || 1);
  const meta = obtenerMetaSmsItem(item);

  return `
    <article class="sms-pending-item sms-origin-${escapeHTML(tipo)}">
      <button class="sms-pending-main sms-pending-open" type="button" data-action="sms-pendiente-leer" data-index="${escapeHTML(String(index))}">
        ${renderSmsAvatar({ ...item, smsTipoVisible: tipo, nombreCanal: nombre }, 'sms-avatar-pending')}

        <span class="sms-pending-copy">
          <p>${escapeHTML(nombre)}</p>
          <small>${escapeHTML(meta)}</small>
        </span>
      </button>

<div class="sms-pending-actions">
  ${count > 0 ? `<span class="sms-count">${count}</span>` : ''}
</div>
    </article>
  `;
}

function obtenerTipoSmsItem(item) {
  const texto = normalizarTexto([
    item?.nombre,
    item?.nombreCanal,
    item?.asunto,
    item?.tipoConversacion
  ].filter(Boolean).join(' '));

  const soloLectura = item?.soloLectura === true || String(item?.soloLectura).toLowerCase() === 'true';
  const canalFijo = item?.canalFijo === true || String(item?.canalFijo).toLowerCase() === 'true';

  if (
    texto.includes('scria') ||
    texto.includes('secretaria') ||
    texto.includes('capacitacion y formacion politica')
  ) {
    return 'scria';
  }

  if (
    soloLectura ||
    canalFijo ||
    texto.includes('aviso') ||
    texto.includes('sistema')
  ) {
    return 'aviso';
  }

  return 'contacto';
}

function obtenerNombreSmsItem(item) {
  const tipo = obtenerTipoSmsItem(item);

  if (tipo === 'aviso') {
    return 'Avisos';
  }

  if (tipo === 'scria') {
    return 'Scria. Capacitación y Formación Política';
  }

  return (
    item?.contacto?.nombreCompleto ||
    item?.remitenteNombre ||
    item?.nombre ||
    item?.nombreCanal ||
    item?.asunto ||
    'Contacto'
  );
}

function obtenerMetaSmsItem(item) {
  const tipo = obtenerTipoSmsItem(item);

  if (tipo === 'aviso') {
    return 'Solo lectura';
  }

  if (tipo === 'scria') {
    return 'Canal institucional';
  }

  return item?.contacto?.municipio || item?.municipio || 'Conversación';
}

async function abrirPendienteMensaje(indexValue) {
  const index = Number(indexValue);
  const item = appState.mensajesPendientes[index];

  if (!item) {
    return;
  }

  const conversacionId =
    item.conversacionId ||
    item.idConversacion ||
    item.conversationId ||
    item.id ||
    '';

  const contactoMemberId =
    item.contactoMemberId ||
    item.contactMemberId ||
    item.remitenteMemberId ||
    item.senderMemberId ||
    item.memberId ||
    item.contacto?.memberId ||
    '';

  if (conversacionId) {
    const existeConversacion = appState.conversaciones.some((conv) => conv.id === conversacionId);

    if (existeConversacion) {
      await abrirChatConversacion(conversacionId);
      return;
    }

    appState.chatConversacion = {
      id: conversacionId,
      nombreCanal: obtenerNombreSmsItem(item),
      tipoConversacion: item.tipoConversacion || '',
      canalFijo: item.canalFijo === true,
      soloLectura: item.soloLectura === true
    };

    appState.chatContacto = item.contacto || null;
    await cargarChatMensajes(conversacionId);
    return;
  }

  if (contactoMemberId) {
    await abrirChatContacto(contactoMemberId);
  }
}

function obtenerConversacionesDirectas() {
  return appState.conversaciones.filter((conv) => {
    const tipo = String(conv.tipoConversacion || '').toUpperCase();
    const canalFijo = conv.canalFijo === true || String(conv.canalFijo).toLowerCase() === 'true';

    return tipo !== 'CANAL' && canalFijo !== true;
  });
}

function obtenerContactIdDesdeContacto(item) {
  return (
    item?.contactMemberId ||
    item?.contactoMemberId ||
    item?.memberId ||
    item?.contacto?.memberId ||
    ''
  );
}

function contactoEstaEnRegulares(contactMemberId) {
  const id = String(contactMemberId || '').trim();

  if (!id) return false;

  return appState.contactosRegulares.some((item) => {
    const itemId = obtenerContactIdDesdeContacto(item);
    return itemId === id && item.regular !== false;
  });
}

function obtenerNombreContactoRegular(item) {
  return item.contactAlias || item.nombreMostrar || item.nombreCompleto || item.nombre || 'Contacto';
}

function obtenerMetaContactoRegular(item) {
  if (item.contactAlias && item.nombreCompleto) {
    return `${item.nombreCompleto}${item.municipio ? ` · ${item.municipio}` : ''}`;
  }

  return item.municipio || item.codigoControl || 'Contacto regular';
}

function renderBuscarContactos() {
  const abierta = appState.mensajesBusquedaAbierta;
const contactosRegulares = Array.isArray(appState.contactosRegulares) ? appState.contactosRegulares : [];
const modo = appState.contactosModo || 'regulares';
const totalRegulares = contactosRegulares.length;

  return `
    <article class="sms-card sms-contact-card">
      <button class="sms-contact-head-toggle" type="button" data-action="sms-search-toggle">
        <strong>Contactos</strong>

        <span>
          ${totalRegulares > 0 ? `<small>${totalRegulares} regulares</small>` : ''}
          <b>${abierta ? '▾' : '▸'}</b>
        </span>
      </button>

      ${abierta ? `
        <div class="sms-contact-body">
          <div class="sms-contact-tabs">
            <button
              class="${modo === 'regulares' ? 'active' : ''}"
              type="button"
              data-action="sms-contactos-modo"
              data-modo="regulares"
            >
              Contactos regulares
            </button>

            <button
              class="${modo === 'buscar' ? 'active' : ''}"
              type="button"
              data-action="sms-contactos-modo"
              data-modo="buscar"
            >
              Buscar
            </button>
          </div>

          ${modo === 'buscar'
            ? renderContactosBusquedaPanel()
            : renderContactosRegularesPanel(contactosRegulares)
          }
        </div>
      ` : ''}
    </article>
  `;
}

function renderContactosRegularesPanel(contactos) {
  if (appState.contactosRegularesCargando) {
    return `<div class="empty sms-empty">Cargando contactos regulares...</div>`;
  }

  if (appState.contactosRegularesError) {
    return `<div class="empty sms-empty">${escapeHTML(appState.contactosRegularesError)}</div>`;
  }

  if (!contactos.length) {
    return `<div class="empty sms-empty">Sin contactos regulares.</div>`;
  }

  return `
    <div class="sms-contact-list">
      ${contactos.map((contacto) => renderContactoRegularItem(contacto)).join('')}
    </div>
  `;
}

function renderContactoRegularItem(contacto) {
  const contactMemberId = obtenerContactIdDesdeContacto(contacto);
  const nombre = obtenerNombreContactoRegular(contacto);
  const meta = obtenerMetaContactoRegular(contacto);
  const tieneAlias = Boolean(contacto.contactAlias);

  return `
    <article class="sms-contact-item sms-contact-regular-item">
      <button class="sms-contact-open-main" type="button" data-action="chat-contacto" data-member-id="${escapeHTML(contactMemberId)}">
        <div class="sms-contact-main">
          ${renderSmsAvatar(contacto, 'sms-avatar-mini')}

          <div>
            <p>${escapeHTML(nombre)}</p>
            <small>${escapeHTML(meta)}</small>
          </div>
        </div>
      </button>

      <div class="sms-contact-actions">
        <button
          class="sms-contact-alias ${tieneAlias ? 'active' : ''}"
          type="button"
          data-action="contacto-regular-alias"
          data-member-id="${escapeHTML(contactMemberId)}"
          aria-label="Editar alias"
        >
          ✎
        </button>

        <button
          class="sms-contact-remove"
          type="button"
          data-action="contacto-regular-eliminar"
          data-member-id="${escapeHTML(contactMemberId)}"
          aria-label="Quitar contacto regular"
        >
          ×
        </button>
      </div>
    </article>
  `;
}

function renderContactosBusquedaPanel() {
  return `
    <div class="sms-contact-search">
      <label class="sms-search-field">
        <span>🔍</span>
        <input
          type="search"
          placeholder="Buscar por nombre, correo o alias"
          value="${escapeHTML(appState.contactosBusqueda)}"
          data-input="contactos-busqueda"
        />
      </label>

      ${renderContactosResultados()}
    </div>
  `;
}

function renderConversacionDirectaItem(conv) {
  const nombre = conv.contacto?.nombreCompleto || conv.nombreCanal || 'Conversación';

  return `
    <button class="sms-contact-item sms-contact-open" type="button" data-action="chat-conversacion" data-id="${escapeHTML(conv.id)}">
      <div class="sms-contact-main">
        ${renderSmsAvatar(conv.contacto || conv, 'sms-avatar-mini')}

        <div>
          <p>${escapeHTML(nombre)}</p>
          <small>${escapeHTML(conv.contacto?.municipio || conv.tipoConversacion || 'Conversación')}</small>
        </div>
      </div>
    </button>
  `;
}

function renderContactosResultados() {
  if (!appState.contactosBusqueda) {
    return '';
  }

  if (appState.contactosCargando) {
    return `<div class="empty sms-empty">Buscando contactos...</div>`;
  }

  if (appState.contactosError) {
    return `<div class="empty sms-empty">${escapeHTML(appState.contactosError)}</div>`;
  }

  if (!appState.contactosResultados.length) {
    return `<div class="empty sms-empty">Sin resultados.</div>`;
  }

  return `
    <div class="sms-contact-list">
      ${appState.contactosResultados.map((contacto) => `
        <button class="sms-contact-item sms-contact-open" type="button" data-action="chat-contacto" data-member-id="${escapeHTML(contacto.memberId)}">
          <div class="sms-contact-main">
            ${renderSmsAvatar(contacto, 'sms-avatar-mini')}

            <div>
              <p>${escapeHTML(contacto.nombreCompleto || contacto.nombre || 'Contacto')}</p>
              <small>
                ${escapeHTML(contacto.email || contacto.correo || contacto.codigoControl || 'USU')}
                ${contacto.municipio ? ` · ${escapeHTML(contacto.municipio)}` : ''}
              </small>
            </div>
          </div>
        </button>
      `).join('')}
    </div>
  `;
}

function renderChat() {
  const nombre = appState.chatContacto?.nombreCompleto || appState.chatConversacion?.nombreCanal || 'Chat';
  const meta = appState.chatContacto?.municipio || obtenerMetaSmsItem(appState.chatConversacion || {}) || 'Selecciona un contacto';
  const soloLectura = appState.chatConversacion?.soloLectura === true;
   const chatContactMemberId = appState.chatContacto?.memberId || '';
const puedeAgregarContacto =
  appState.chatConversacion &&
  chatContactMemberId &&
  !soloLectura &&
  !contactoEstaEnRegulares(chatContactMemberId);

  return `
    <article class="sms-card sms-chat-card">
<div class="sms-chat-header">
  <div class="sms-chat-identity">
    ${renderSmsAvatar(appState.chatContacto || appState.chatConversacion || {}, 'sms-avatar-chat')}

    <div>
      <h3>${escapeHTML(appState.chatConversacion ? nombre : 'Chat')}</h3>
      <p>${escapeHTML(appState.chatConversacion ? meta : 'Selecciona un pendiente o contacto.')}</p>
    </div>
  </div>

  ${puedeAgregarContacto ? `
    <button
      class="sms-add-contact"
      type="button"
      data-action="contacto-regular-agregar"
      data-member-id="${escapeHTML(chatContactMemberId)}"
    >
      + Contacto
    </button>
  ` : ''}
</div>
          ${renderSmsAvatar(appState.chatContacto || appState.chatConversacion || {}, 'sms-avatar-chat')}

          <div>
            <h3>${escapeHTML(appState.chatConversacion ? nombre : 'Chat')}</h3>
            <p>${escapeHTML(appState.chatConversacion ? meta : 'Selecciona un pendiente o contacto.')}</p>
          </div>
        </div>
      </div>

      ${appState.chatError ? `<div class="empty sms-empty">${escapeHTML(appState.chatError)}</div>` : ''}

      <div class="sms-chat-box">
        ${renderChatMensajes()}
      </div>

      ${appState.chatConversacion && !soloLectura ? `
        <div class="sms-send-row">
          <textarea
            class="sms-input sms-textarea"
            rows="2"
            placeholder="Escribe un mensaje..."
            data-input="chat-texto"
          >${escapeHTML(appState.chatTexto)}</textarea>

<button
  class="btn btn-primary"
  type="button"
  data-action="chat-enviar"
  ${appState.chatEnviando ? 'disabled' : ''}
>
  ${appState.chatEnviando ? 'Enviando...' : 'Enviar'}
</button>
        </div>
      ` : ''}
    </article>
  `;
}

function renderChatMensajes() {
  if (!appState.chatConversacion) {
    return `<div class="empty sms-empty">Selecciona un pendiente o contacto para abrir el chat.</div>`;
  }

  if (appState.chatCargando) {
    return `<div class="empty sms-empty">Cargando mensajes...</div>`;
  }

  if (!appState.chatMensajes.length) {
    return `<div class="empty sms-empty">Sin mensajes todavía.</div>`;
  }

  let html = '';
  let ultimoGrupoFecha = '';

  appState.chatMensajes.forEach((msg) => {
    const fechaGrupo = obtenerClaveFechaMensaje(msg);
    const etiquetaGrupo = obtenerEtiquetaFechaMensaje(msg);

    if (fechaGrupo !== ultimoGrupoFecha) {
      html += `
        <div class="sms-date-divider">
          <span>${escapeHTML(etiquetaGrupo)}</span>
        </div>
      `;
      ultimoGrupoFecha = fechaGrupo;
    }

    html += `
      <div class="sms-message-row ${msg.mio ? 'mine' : 'theirs'}">
        <div class="sms-bubble ${msg.mio ? 'mine' : 'theirs'}">
          <p>${escapeHTML(msg.mensaje || '')}</p>
          <span>${escapeHTML(obtenerHoraMensaje(msg))}</span>
        </div>
      </div>
    `;
  });

  return html;
}

function obtenerFechaMensajeValor(msg) {
  return (
    msg.fechaEnvio ||
    msg.fechaPublicacion ||
    msg._createdDate ||
    msg.fecha ||
    msg.createdAt ||
    ''
  );
}

function obtenerClaveFechaMensaje(msg) {
  const valor = obtenerFechaMensajeValor(msg);

  if (!valor) return 'sin-fecha';

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) return 'sin-fecha';

  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function obtenerEtiquetaFechaMensaje(msg) {
  const valor = obtenerFechaMensajeValor(msg);

  if (!valor) return 'Sin fecha';

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) return 'Sin fecha';

  const hoy = new Date();
  const hoyClave = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  const fechaClave = obtenerClaveFechaMensaje(msg);

  if (fechaClave === hoyClave) {
    return 'Hoy';
  }

  return fecha.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function obtenerHoraMensaje(msg) {
  const valor = obtenerFechaMensajeValor(msg);

  if (!valor) return '';

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) return '';

  return fecha.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderSmsAvatar(item, extraClass) {
  const tipo = item?.smsTipoVisible || obtenerTipoSmsItem(item || {});
  const nombre = item?.nombreCompleto || item?.nombreCanal || item?.nombre || 'M';
  const avatarUrl = item?.avatarUrl || item?.fotoPerfil || item?.foto || item?.photo || item?.fotoPersonal || '';

  if (tipo === 'aviso') {
    return `
      <span class="sms-avatar sms-avatar-aviso ${escapeHTML(extraClass || '')}">
        A
      </span>
    `;
  }

  if (tipo === 'scria') {
    return `
      <span class="sms-avatar sms-avatar-scria ${escapeHTML(extraClass || '')}">
        CF
      </span>
    `;
  }

  return `
    <span class="sms-avatar ${escapeHTML(extraClass || '')}">
      ${avatarUrl ? `
        <img src="${escapeHTML(avatarUrl)}" alt="${escapeHTML(nombre)}" />
      ` : `
        ${escapeHTML(obtenerInicialesUsuario(nombre))}
      `}
    </span>
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
    actualizarDatosPwa();
  });
});

   document.querySelectorAll('[data-action="instalar-pwa"]').forEach((el) => {
  el.addEventListener('click', function () {
    instalarPwa();
  });
});

document.querySelectorAll('[data-action="tutorial-ios"]').forEach((el) => {
  el.addEventListener('click', function () {
    abrirTutorialIos();
  });
});

   document.querySelectorAll('[data-action="iniciar-sesion"]').forEach((el) => {
  el.addEventListener('click', function () {
    window.location.href = MOR_ACCESS_URL;
  });
});

   document.querySelectorAll('[data-action="modulo-bloqueado"]').forEach((el) => {
  el.addEventListener('click', function () {
    window.location.href = MOR_ACCESS_URL;
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

  document.querySelectorAll('[data-input="contactos-busqueda"]').forEach((el) => {
    el.addEventListener('input', function () {
      appState.contactosBusqueda = el.value || '';

      if (appState.contactosBusquedaTimer) {
        window.clearTimeout(appState.contactosBusquedaTimer);
      }

      appState.contactosBusquedaTimer = window.setTimeout(function () {
        buscarContactosPwa();
      }, 350);
    });
  });

     document.querySelectorAll('[data-action="sms-search-toggle"]').forEach((el) => {
    el.addEventListener('click', function () {
      appState.mensajesBusquedaAbierta = !appState.mensajesBusquedaAbierta;
      renderApp();
    });
  });

   document.querySelectorAll('[data-action="sms-contactos-modo"]').forEach((el) => {
  el.addEventListener('click', function () {
    appState.contactosModo = el.getAttribute('data-modo') || 'regulares';
    renderApp();
  });
});

   document.querySelectorAll('[data-action="sms-pendientes-toggle"]').forEach((el) => {
  el.addEventListener('click', function () {
    appState.mensajesPendientesAbierto = appState.mensajesPendientesAbierto === false;
    renderApp();
  });
});

     document.querySelectorAll('[data-action="sms-pendiente-leer"]').forEach((el) => {
    el.addEventListener('click', function () {
      abrirPendienteMensaje(el.getAttribute('data-index') || '');
    });
  });

document.querySelectorAll('[data-action="chat-contacto"]').forEach((el) => {
  el.addEventListener('click', function () {
    appState.mensajesBusquedaAbierta = false;
    abrirChatContacto(el.getAttribute('data-member-id') || '');
  });
});

document.querySelectorAll('[data-action="contacto-regular-agregar"]').forEach((el) => {
  el.addEventListener('click', function () {
    agregarContactoRegular(el.getAttribute('data-member-id') || '');
  });
});

document.querySelectorAll('[data-action="contacto-regular-alias"]').forEach((el) => {
  el.addEventListener('click', function () {
    actualizarAliasContactoRegular(el.getAttribute('data-member-id') || '');
  });
});

document.querySelectorAll('[data-action="contacto-regular-eliminar"]').forEach((el) => {
  el.addEventListener('click', function () {
    eliminarContactoRegular(el.getAttribute('data-member-id') || '');
  });
});

document.querySelectorAll('[data-action="chat-conversacion"]').forEach((el) => {
  el.addEventListener('click', function () {
    appState.mensajesBusquedaAbierta = false;
    abrirChatConversacion(el.getAttribute('data-id') || '');
  });
});

  document.querySelectorAll('[data-input="chat-texto"]').forEach((el) => {
    el.addEventListener('input', function () {
      appState.chatTexto = el.value || '';
    });
  });

  document.querySelectorAll('[data-action="chat-enviar"]').forEach((el) => {
    el.addEventListener('click', function () {
      enviarMensajeChat();
    });
  });

  document.querySelectorAll('[data-action="abrir-panel-adm"]').forEach((el) => {
    el.addEventListener('click', function () {
      abrirPanelADM();
    });
  });

   document.querySelectorAll('[data-action="abrir-mis-actividades"]').forEach((el) => {
  el.addEventListener('click', function () {
    abrirMisActividades();
  });
});

document.querySelectorAll('[data-action="facebook-modal-abrir"]').forEach((el) => {
  el.addEventListener('click', function () {
    appState.facebookModal = true;
    renderApp();
  });
});

document.querySelectorAll('[data-action="facebook-modal-cerrar"]').forEach((el) => {
  el.addEventListener('click', function () {
    appState.facebookModal = false;
    renderApp();
  });
});

document.querySelectorAll('[data-action="facebook-abrir"]').forEach((el) => {
  el.addEventListener('click', function () {
    abrirFacebookInicio();
  });
});

  document.querySelectorAll('[data-action="multimedia-reciente"]').forEach((el) => {
    el.addEventListener('click', function () {
      abrirMultimediaReciente();
    });
  });

  document.querySelectorAll('[data-action="logout-lite"]').forEach((el) => {
    el.addEventListener('click', function () {
      cerrarSesionLocal();
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

function abrirMultimediaReciente() {
  const item = obtenerMultimediaActual();

  appState.vistaActual = 'multimedia';

  if (item && item.id) {
    appState.multimediaActualId = item.id;
    appState.multimediaModal = item.urlEmbed ? 'ver' : 'info';
  }

  renderApp();
}

function abrirFacebookInicio() {
  const item = obtenerFacebookInicioActual();
  const url = item.urlContenido || item.urlMultimedia || MORENA_FACEBOOK_URL;

  if (!url) {
    return;
  }

  window.location.href = url;
}

function cerrarSesionLocal() {
  const confirmar = window.confirm('¿Deseas cerrar sesión?');

  if (!confirmar) {
    return;
  }

  window.location.replace(`${MOR_ACCESS_URL}?logout=1`);
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
   configurarInstalacionPwa();

if (memberId) {
await cargarUsuarioPwa(memberId);
await cargarDocumentosPwa(memberId);
await cargarMultimediaPwa(memberId);
await cargarMensajesPwa(memberId);
}
}

configurarInstalacionPwa();

document.addEventListener('DOMContentLoaded', inicializarApp);
