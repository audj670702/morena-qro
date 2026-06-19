/*
MORENA QRO Capacitación
Archivo: css/styles.css
Versión: v1.10.2.2
Alcance: estilos base de la PWA usuario
*/

/* =========================================================
   BLOQUE 01. VARIABLES
   ========================================================= */

:root {
  --morena-primary: #7A0B2E;
  --morena-dark: #3B0618;
  --morena-soft: #F8EEF3;
  --morena-border: rgba(122, 11, 46, 0.18);

  --text-main: #261018;
  --text-muted: #75616A;
  --white: #FFFFFF;

  --ok: #137A3A;
  --warn: #B45309;
  --danger: #B91C1C;

  --shadow: 0 14px 34px rgba(59, 6, 24, 0.13);
}

/* =========================================================
   BLOQUE 02. RESET BASE
   ========================================================= */

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(122, 11, 46, 0.14), transparent 34%),
    linear-gradient(180deg, #FFFFFF 0%, #F9F2F5 100%);
  color: var(--text-main);
}

body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12px;
}

/* =========================================================
   BLOQUE 03. LAYOUT APP
   ========================================================= */

.app {
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid var(--morena-border);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.app-body {
  padding: 12px;
}

.hidden {
  display: none !important;
}

/* =========================================================
   BLOQUE 04. HEADER / TOPBAR
   ========================================================= */

.app-header {
  position: relative;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 9px;
  padding: 11px;
  color: var(--white);
  background: linear-gradient(135deg, rgba(122, 11, 46, 0.98), rgba(59, 6, 24, 0.96));
}

.topbar-session,
.topbar-icon {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.13);
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 900;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.topbar-session:disabled {
  opacity: 0.46;
  cursor: default;
}

.app-logo-img {
  width: 38px;
  height: 38px;
  border-radius: 13px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.96);
  padding: 4px;
}

.topbar-titlebox {
  min-width: 0;
}

.app-title {
  margin: 0;
  font-size: 16px;
  line-height: 1.05;
  font-weight: 850;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-subtitle {
  margin: 2px 0 0;
  font-size: 11px;
  opacity: 0.88;
  font-weight: 620;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.install-pill {
  padding: 6px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.13);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 800;
}

.powered-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px 11px;
  font-size: 10.5px;
  color: rgba(117, 97, 106, 0.78);
}

.powered-footer img {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  object-fit: contain;
}

/* =========================================================
   BLOQUE 05. NAVEGACIÓN
   ========================================================= */

.nav-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 7px;
  margin-top: 8px;
}

.nav-list {
  margin-top: 9px;
}

.nav-card {
  position: relative;
  width: 100%;
  min-height: 48px;
  border: 1px solid var(--morena-border);
  border-radius: 15px;
  background: #FFFFFF;
  color: var(--text-main);
  padding: 8px 10px;
  text-align: left;
  cursor: pointer;
}

.nav-card:active {
  transform: scale(0.99);
}

.nav-row {
  display: grid;
  grid-template-columns: 34px 1fr auto auto;
  align-items: center;
  gap: 9px;
}

.nav-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: var(--morena-soft);
  color: var(--morena-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 850;
  font-size: 12px;
  margin-bottom: 0;
}

.nav-title {
  margin: 0;
  font-size: 13.4px;
  font-weight: 820;
  line-height: 1.15;
}

.nav-desc {
  display: none;
}

.nav-chevron {
  color: rgba(122, 11, 46, 0.72);
  font-size: 21px;
  line-height: 1;
  font-weight: 650;
}

.nav-badge {
  position: static;
  min-width: 23px;
  text-align: center;
  padding: 3px 7px;
}

.adm-row {
  background: linear-gradient(90deg, #FFFFFF, #F8EEF3);
}

.adm-row .nav-icon {
  background: var(--morena-primary);
  color: #FFFFFF;
}

/* =========================================================
   BLOQUE 06. CARDS
   ========================================================= */

.section-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 850;
  line-height: 1.15;
}

.section-note {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.35;
}

.info-card {
  border: 1px solid var(--morena-border);
  background: #FFFFFF;
  border-radius: 16px;
  padding: 11px;
  margin-bottom: 8px;
}

.info-title {
  margin: 0;
  font-size: 14px;
  font-weight: 820;
  line-height: 1.2;
}

.info-meta {
  margin: 4px 0 0;
  font-size: 11.8px;
  color: var(--text-muted);
  line-height: 1.3;
}

/* =========================================================
   BLOQUE HOME / IDENTIDAD / BANNERS v1.10.0
   ========================================================= */

.home-screen {
  display: grid;
  gap: 8px;
}

.identity-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  min-height: 58px;
  border: 0;
  background: transparent;
  border-radius: 0;
  padding: 8px;
}

.identity-avatar {
  position: relative;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 14px;
  padding: 0;
  display: grid;
  place-items: center;
  background: var(--morena-soft);
  color: var(--morena-primary);
  font-size: 14px;
  font-weight: 900;
  overflow: visible;
  cursor: pointer;
}

.identity-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  object-fit: cover;
}

.identity-avatar small {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 17px;
  height: 17px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--morena-primary);
  color: #FFFFFF;
  font-size: 9px;
  border: 2px solid #FFFFFF;
}

.identity-main {
  min-width: 0;
}

.identity-main h2 {
  margin: 0;
  font-size: 12px;
  line-height: 1.12;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.identity-main p {
  margin: 2px 0 0;
  font-size: 10.7px;
  line-height: 1.12;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.identity-main strong {
  color: var(--morena-primary);
  font-weight: 820;
}

.identity-tech {
  display: grid;
  justify-items: end;
  gap: 2px;
  min-width: 82px;
  padding-left: 7px;
  border-left: 1px solid rgba(122, 11, 46, 0.11);
}

.identity-tech span {
  font-size: 8.6px;
  color: rgba(117, 97, 106, 0.48);
  font-weight: 400;
  white-space: nowrap;
}

.identity-tech small {
  font-size: 8.8px;
  color: rgba(117, 97, 106, 0.48);
  font-weight: 400;
}

.home-banner {
  width: 100%;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 9px;
  min-height: 62px;
  border: 1px solid var(--morena-border);
  border-radius: 16px;
  padding: 8px;
  text-align: left;
  cursor: pointer;
}

.media-recent-banner {
  background: linear-gradient(90deg, #FFFFFF, #F8EEF3);
}

.facebook-recent-banner {
  background: linear-gradient(90deg, #FFFFFF, #EEF5FF);
  border-color: rgba(37, 99, 235, 0.14);
}

.banner-thumb {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: var(--morena-primary);
  color: #FFFFFF;
  font-size: 20px;
  font-weight: 900;
}

.banner-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fb-thumb {
  background: #1877F2;
  color: #FFFFFF;
  font-family: Arial, sans-serif;
  font-size: 25px;
}

.banner-copy {
  display: grid;
  gap: 1px;
  min-width: 0;
}

.banner-copy strong {
  font-size: 12.5px;
  color: var(--text-main);
  line-height: 1.1;
}

.banner-copy span {
  font-size: 11.3px;
  color: var(--morena-primary);
  font-weight: 760;
  line-height: 1.16;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-copy small {
  font-size: 10.3px;
  color: var(--text-muted);
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-access {
  font-size: 22px;
  color: rgba(122, 11, 46, 0.72);
  font-weight: 680;
}

/* =========================================================
   BLOQUE 07. LISTAS COMPACTAS
   ========================================================= */

.list {
  display: grid;
  gap: 8px;
}

.list-row {
  width: 100%;
  border: 1px solid var(--morena-border);
  background: #FFFFFF;
  border-radius: 15px;
  padding: 9px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  text-align: left;
}

.list-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 820;
  line-height: 1.2;
}

.list-meta {
  margin: 3px 0 0;
  font-size: 11.3px;
  color: var(--text-muted);
  line-height: 1.25;
}

/* =========================================================
   BLOQUE 08. ESTADOS / BADGES
   ========================================================= */

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 7px;
}

.badge {
  padding: 4px 7px;
  border-radius: 999px;
  background: var(--morena-soft);
  color: var(--morena-primary);
  border: 1px solid var(--morena-border);
  font-size: 10.8px;
  font-weight: 760;
}

.badge.ok {
  background: rgba(19, 122, 58, 0.08);
  color: var(--ok);
  border-color: rgba(19, 122, 58, 0.22);
}

.badge.warn {
  background: rgba(180, 83, 9, 0.08);
  color: var(--warn);
  border-color: rgba(180, 83, 9, 0.22);
}

.badge.danger {
  background: #FFF1F2;
  color: var(--danger);
  border-color: rgba(185, 28, 28, 0.22);
}

.empty {
  border: 1px dashed var(--morena-border);
  background: rgba(255, 255, 255, 0.75);
  border-radius: 16px;
  padding: 14px 12px;
  text-align: center;
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.35;
}

/* =========================================================
   BLOQUE 09. FORMULARIOS / BOTONES
   ========================================================= */

.input {
  width: 100%;
  min-height: 38px;
  border: 1px solid var(--morena-border);
  border-radius: 13px;
  padding: 8px 10px;
  font-size: 13px;
  color: var(--text-main);
  background: #FFFFFF;
  outline: none;
}

.input:focus {
  border-color: rgba(122, 11, 46, 0.52);
  box-shadow: 0 0 0 3px rgba(122, 11, 46, 0.08);
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}

.btn {
  width: 100%;
  min-height: 38px;
  border: none;
  border-radius: 13px;
  padding: 9px 10px;
  font-size: 12.5px;
  font-weight: 760;
  cursor: pointer;
}

.btn-primary {
  background: var(--morena-primary);
  color: var(--white);
}

.btn-secondary {
  background: var(--morena-soft);
  color: var(--morena-primary);
  border: 1px solid var(--morena-border);
}

/* =========================================================
   BLOQUE 10. RESPONSIVE
   ========================================================= */

@media (max-width: 360px) {
  body {
    padding: 10px;
  }

  .app-body {
    padding: 11px;
  }

  .app-title {
    font-size: 19px;
  }

  .nav-grid {
    gap: 7px;
  }

  .nav-card {
    min-height: 66px;
    padding: 9px;
  }
}

/* =========================================================
   BLOQUE MULTIMEDIA v1.8
   ========================================================= */

.media-hero {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(135deg, #7A0B2E, #3B0618);
  color: #FFFFFF;
  padding: 16px;
  min-height: 230px;
  box-shadow: 0 16px 42px rgba(59, 6, 24, 0.14);
}

.media-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 82% 20%, rgba(255,255,255,0.20), transparent 26%),
    radial-gradient(circle at 15% 85%, rgba(255,255,255,0.10), transparent 30%);
  pointer-events: none;
}

.media-hero-content {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 11px;
}

.media-eyebrow {
  display: inline-flex;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.20);
}

.media-visual {
  width: 64px;
  height: 64px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.26);
  font-size: 28px;
  font-weight: 900;
}

.media-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-hero h3 {
  margin: 0;
  font-size: 23px;
  line-height: 1.1;
}

.media-hero p {
  margin: 0;
  font-size: 13px;
  line-height: 1.42;
  opacity: 0.92;
}

.media-meta {
  font-size: 12px;
  font-weight: 760;
  opacity: 0.88;
}

.media-actions {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 8px;
}

.media-action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
}

.media-action-card {
  border: 1px solid rgba(122, 11, 46, 0.16);
  border-radius: 20px;
  background: rgba(255,255,255,0.96);
  padding: 14px;
  box-shadow: 0 10px 26px rgba(59, 6, 24, 0.08);
  text-align: left;
  cursor: pointer;
}

.media-action-card strong {
  display: block;
  font-size: 14px;
  color: #261018;
}

.media-action-card span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #75616A;
  line-height: 1.3;
}

.media-section-card {
  margin-top: 12px;
  background: rgba(255,255,255,0.96);
  border: 1px solid rgba(122, 11, 46, 0.16);
  border-radius: 22px;
  padding: 14px;
  box-shadow: 0 10px 26px rgba(59, 6, 24, 0.08);
}

.media-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.media-section-head h3 {
  margin: 0;
  font-size: 15px;
}

.media-section-head button {
  border: 0;
  background: #F8EEF3;
  color: #7A0B2E;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 820;
  cursor: pointer;
}

.media-mini-grid,
.media-result-list {
  display: grid;
  gap: 9px;
}

.media-mini-card {
  display: grid;
  grid-template-columns: 46px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 17px;
  background: #FFF7FA;
  border: 1px solid rgba(122, 11, 46, 0.10);
}

.media-mini-icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #7A0B2E;
  color: #FFFFFF;
  font-weight: 900;
}

.media-mini-title {
  margin: 0;
  font-size: 13px;
  font-weight: 820;
  line-height: 1.2;
}

.media-mini-meta {
  margin: 3px 0 0;
  font-size: 11px;
  color: #75616A;
}

.media-pill {
  border: 0;
  border-radius: 999px;
  padding: 7px 10px;
  background: #7A0B2E;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 820;
  cursor: pointer;
}

.media-overlay {
  position: fixed;
  inset: 0;
  background: rgba(38, 16, 24, 0.38);
  display: none;
  align-items: flex-end;
  justify-content: center;
  padding: 14px;
  z-index: 100;
}

.media-overlay.open {
  display: flex;
}

.media-modal {
  width: 100%;
  max-width: 520px;
  max-height: 88vh;
  overflow: auto;
  background: #FFFFFF;
  border-radius: 26px;
  padding: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.28);
}

.media-modal-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.media-modal-head h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.16;
}

.media-close {
  border: 0;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #F8EEF3;
  color: #7A0B2E;
  font-weight: 900;
  cursor: pointer;
}

.media-detail-row {
  padding: 10px 0;
  border-top: 1px solid rgba(122, 11, 46, 0.10);
}

.media-detail-label {
  margin: 0 0 3px;
  font-size: 11px;
  color: #75616A;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.media-detail-value {
  margin: 0;
  font-size: 13px;
  line-height: 1.35;
  color: #261018;
}

.media-search-box {
  display: grid;
  gap: 10px;
}

.media-input,
.media-select {
  width: 100%;
  min-height: 42px;
  border: 1px solid rgba(122, 11, 46, 0.16);
  border-radius: 15px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  background: #FFFFFF;
  color: #261018;
}

.media-chips {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.media-chip {
  flex: 0 0 auto;
  border: 1px solid rgba(122, 11, 46, 0.16);
  border-radius: 999px;
  background: #FFFFFF;
  color: #7A0B2E;
  padding: 8px 11px;
  font-size: 12px;
  font-weight: 820;
  cursor: pointer;
}

.media-chip.active {
  background: #7A0B2E;
  color: #FFFFFF;
}

.media-empty {
  padding: 14px;
  border-radius: 16px;
  background: #F8EEF3;
  color: #75616A;
  font-size: 13px;
  line-height: 1.35;
}

@media (max-width: 360px) {
  .media-actions,
  .media-action-grid {
    grid-template-columns: 1fr;
  }

  .media-hero h3 {
    font-size: 21px;
  }
}

.media-actions.single {
  grid-template-columns: 1fr;
}

/* =========================================================
   BLOQUE MULTIMEDIA PLAYER v1.8.2
   ========================================================= */

.media-modal-player {
  padding: 14px;
}

.media-player {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 18px;
  background: #260812;
  border: 1px solid rgba(122, 11, 46, 0.16);
}

.media-player iframe {
  width: 100%;
  height: 100%;
  display: block;
}

.media-player-meta {
  display: grid;
  gap: 2px;
  margin-top: 10px;
  font-size: 12px;
  color: #75616A;
}

.media-player-meta strong {
  color: #261018;
  font-size: 13px;
}

.media-full-btn {
  width: 100%;
  margin-top: 12px;
}

/* =========================================================
   BLOQUE MENSAJES / CHAT v1.8.4
   ========================================================= */

.compact-list {
  gap: 6px;
  margin-top: 8px;
}

.message-search {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
  margin-top: 8px;
}

.chat-box {
  display: grid;
  gap: 7px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid rgba(122, 11, 46, 0.12);
  border-radius: 16px;
  background: #FFF8FB;
}

.chat-bubble {
  width: fit-content;
  max-width: 82%;
  padding: 8px 10px;
  border-radius: 15px;
  border: 1px solid rgba(122, 11, 46, 0.12);
  background: #FFFFFF;
}

.chat-bubble.mine {
  justify-self: end;
  background: #7A0B2E;
  color: #FFFFFF;
  border-color: #7A0B2E;
  border-bottom-right-radius: 5px;
}

.chat-bubble.theirs {
  justify-self: start;
  background: #FFFFFF;
  color: #261018;
  border-bottom-left-radius: 5px;
}

.chat-bubble p {
  margin: 0;
  font-size: 13px;
  line-height: 1.35;
}

.chat-bubble span {
  display: block;
  margin-top: 4px;
  font-size: 10px;
  opacity: 0.7;
}

.chat-input-row {
  display: grid;
  gap: 7px;
  margin-top: 9px;
}

.chat-input-row textarea {
  resize: vertical;
  min-height: 58px;
}

@media (max-width: 360px) {
  .chat-bubble {
    max-width: 88%;
  }

  .chat-box {
    padding: 8px;
  }
}
