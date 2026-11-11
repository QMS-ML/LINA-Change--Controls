/*!
 * LINA QMS — who can open which page (role-based access)
 * Keep this file in the same folder as the HTML pages.
 * The login page is index.html.
 * Every page loads it: Home hides the buttons a role can't use, and each page
 * sends the user back to Home if their role isn't allowed.
 *
 * Roles = the "Level" in the Users sheet (login).
 * To change access: add or remove a role in the list next to the page.
 */
const LINA_ROLES = ['Initiator', 'Department Head', 'Compliance Executive', 'QA Manager'];

const LINA_ACCESS = {
  //  page                       roles allowed
  'CHANGE_CONTROL.html':       ['Initiator', 'Compliance Executive', 'QA Manager'],       // Change Control Initiation
  'CC_APPROVAL.html':          ['Department Head', 'QA Manager'],                         // Initial Approval
  'CC_FINAL_APPROVAL.html':    ['QA Manager'],                                            // Final Approval
  'IA_OTHER.html':             ['Compliance Executive', 'QA Manager'],                    // Impact Assessment – Assign Departments
  'IA_COMMENT.html':           ['Department Head', 'QA Manager'],                         // Impact Assessment – Department Comments (own department only)
  'IA_QC.html':                ['Compliance Executive', 'QA Manager'],                    // Quality Compliance IA
  'ACTION_PLAN.html':          ['Compliance Executive', 'QA Manager'],                    // Action Plan Registration
  'CC_PROGRESS.html':          ['Initiator', 'Department Head', 'Compliance Executive', 'QA Manager'], // Track My CC – CC Tracker (each sees own scope)
  'ACTION_TRACKER.html':       ['Initiator', 'Department Head', 'Compliance Executive', 'QA Manager'], // Track My CC – Action Item Tracker
  'ACTION_STATUS.html':        ['Compliance Executive', 'QA Manager'],                    // Progress Update – Action Item
  'ANALYTICS.html':            ['Department Head', 'Compliance Executive', 'QA Manager'], // Analytics
  'AUDIT_TRAIL.html':          ['Initiator', 'Department Head', 'Compliance Executive', 'QA Manager'], // View Audit Trails
  'PDF.html':                  ['Compliance Executive', 'QA Manager']                     // CC Form (PDF)
  // HOME.html and index.html are open to every logged-in user
};

function linaUser(){
  try { return JSON.parse(sessionStorage.getItem('lina_user') || 'null'); } catch (_) { return null; }
}
function linaCan(page, level){
  const allowed = LINA_ACCESS[String(page || '').split('?')[0]];
  return !allowed || allowed.indexOf(level) > -1;
}

// Page guard: not logged in → LOGIN; role not allowed → HOME
(function(){
  const page = decodeURIComponent(location.pathname.split('/').pop() || '');
  if (page === 'index.html' || page === '') return;   // the login page (also when opened as just the folder / site address)
  const u = linaUser();
  if (!u) { location.replace('index.html'); return; }
  if (!linaCan(page, u.level)) location.replace('HOME.html?denied=' + encodeURIComponent(page));
})();

/* ===== Icon buttons: Home, Back, Logout (same look on every page, in the LINA UI style) ===== */
(function(){
  const ICON = {
    home:   '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h4.5v-5.5h3V20H18V9.5"/></svg>',
    back:   '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg>',
    power:  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 3v8"/><path d="M7.2 6.2a8 8 0 1 0 9.6 0"/></svg>'
  };
  const CSS = `
  .gl-btn{display:inline-flex !important;align-items:center;justify-content:center;gap:8px;padding:0 !important;cursor:pointer;
    text-decoration:none !important;font-family:inherit;border:none !important;color:#fff !important;
    background:var(--blue,#0f4c81) !important;box-shadow:0 2px 8px rgba(15,76,129,.22) !important;transition:background .15s,transform .12s,box-shadow .15s;}
  .gl-btn svg{width:20px;height:20px;flex:none;}
  .gl-btn:hover{background:var(--blue-dark,#0a3459) !important;box-shadow:0 4px 12px rgba(15,76,129,.3) !important;transform:translateY(-1px);}
  .gl-btn:active{transform:translateY(0);}
  .gl-btn:focus-visible{outline:3px solid #5fd0dc;outline-offset:2px;}
  .gl-round{width:40px !important;height:40px !important;min-width:40px;border-radius:50% !important;}
  .gl-logout{height:40px !important;padding:0 16px 0 12px !important;border-radius:20px !important;font-size:13px !important;font-weight:600 !important;}
  .gl-logout svg{width:18px;height:18px;}
  header.header-dark .gl-btn{background:rgba(255,255,255,.12) !important;border:1px solid rgba(255,255,255,.28) !important;box-shadow:none !important;}
  header.header-dark .gl-btn:hover{background:rgba(255,255,255,.22) !important;}
  .gl-wrap{display:inline-flex;align-items:center;gap:10px;background:none !important;border:none !important;padding:0 !important;cursor:pointer;
    font-weight:600;font-size:13.5px;color:var(--blue,#0f4c81);font-family:inherit;text-decoration:none !important;}
  .gl-wrap .gl-dot{width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;
    background:var(--blue-light,#e8f0f8);color:var(--blue,#0f4c81);border:1px solid var(--border,#dce3eb);transition:background .15s,color .15s;}
  .gl-wrap .gl-dot svg{width:16px;height:16px;}
  .gl-wrap:hover .gl-dot{background:var(--blue,#0f4c81);color:#fff;}`;
  // Long words / pasted text without spaces wrap inside their box instead of running off the page
  const WRAP_CSS = `
  p, li, h1, h2, h3, h4, b, span, label, small, div, dd, dt{overflow-wrap:break-word;}
  td, th, .cm, .done-cm, .sec p, .meta-grid b, .dsec p{overflow-wrap:anywhere;word-break:break-word;}
  .rv-title, .rv-no, .ttl, .cc, h1, h2, h3, .title-bar p{overflow-wrap:anywhere;}
  .rv-head > *, .title-bar > *, td > div{min-width:0;}
  .sec p, .dsec p, .done-cm{white-space:pre-wrap;}`;
  function style(){ if (document.getElementById('gl-css')) return; const s = document.createElement('style'); s.id = 'gl-css'; s.textContent = CSS + WRAP_CSS; document.head.appendChild(s); }
  function iconOnly(el, cls, icon, label){
    el.classList.add('gl-btn', ...cls); el.innerHTML = icon; el.title = label; el.setAttribute('aria-label', label);
  }
  function withLabel(el, icon, cls, text){
    el.classList.add('gl-wrap'); el.innerHTML = '<span class="gl-dot">' + icon + '</span><span>' + text + '</span>';
  }
  function apply(){
    style();
    // dark (gradient) headers, e.g. Home, get light-on-dark buttons
    document.querySelectorAll('header').forEach(h => { if ((getComputedStyle(h).backgroundImage || 'none') !== 'none') h.classList.add('header-dark'); });
    document.querySelectorAll('.btn-home, #btnHome').forEach(el => iconOnly(el, ['gl-round'], ICON.home, 'Home'));
    document.querySelectorAll('.btn-logout, .btn-back[onclick*="logout"]').forEach(el => {
      el.classList.add('gl-btn', 'gl-logout'); el.innerHTML = ICON.power + '<span>Logout</span>'; el.title = 'Logout'; el.setAttribute('aria-label', 'Logout');
    });
    document.querySelectorAll('.btn-backlist').forEach(el => withLabel(el, ICON.back, '', (el.textContent || '').replace(/^\s*←\s*/, '') || 'Back'));
    document.querySelectorAll('button.back').forEach(el => withLabel(el, ICON.back, '', 'Back'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
