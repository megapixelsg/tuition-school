/* EduCentre SMS — UI prototype shell
   Injects the sidebar + topbar, handles the role switcher, tabs and
   prototype toasts. No backend: everything is mock/static. */

(function () {
  const ROLES = {
    super:   { label: 'Super Admin',    badge: 'bg-violet-100 text-violet-700' },
    manager: { label: 'Branch Manager', badge: 'bg-sky-100 text-sky-700' },
    teacher: { label: 'Teacher',        badge: 'bg-emerald-100 text-emerald-700' },
  };

  const NAV = [
    { section: 'Overview' },
    { href: 'dashboard.html',   icon: '📊', label: 'Dashboard',            roles: ['super', 'manager'] },
    { section: 'Operations' },
    { href: 'students.html',    icon: '🎓', label: 'Students',             roles: ['super', 'manager', 'teacher'] },
    { href: 'schedule.html',    icon: '🗓️', label: 'Schedule & Classes',   roles: ['super', 'manager', 'teacher'] },
    { href: 'attendance.html',  icon: '✅', label: 'Attendance',           roles: ['super', 'manager', 'teacher'] },
    { href: 'assessments.html', icon: '📝', label: 'Assessments',          roles: ['super', 'manager', 'teacher'] },
    { section: 'Finance & Stock' },
    { href: 'billing.html',     icon: '💳', label: 'Billing & Payments',   roles: ['super', 'manager'] },
    { href: 'inventory.html',   icon: '📦', label: 'Inventory',            roles: ['super', 'manager'] },
    { section: 'Growth' },
    { href: 'campaigns.html',   icon: '📣', label: 'Campaigns',            roles: ['super', 'manager'] },
    { href: 'reports.html',     icon: '📄', label: 'Reports',              roles: ['super', 'manager'] },
    { section: 'Administration' },
    { href: 'audit.html',       icon: '🔍', label: 'Audit Log',            roles: ['super'] },
    { href: 'settings.html',    icon: '⚙️', label: 'Settings',             roles: ['super'] },
  ];

  function currentRole() {
    const r = localStorage.getItem('sms-role');
    return ROLES[r] ? r : 'super';
  }

  function setRole(r) {
    localStorage.setItem('sms-role', r);
    renderSidebar();
    renderRoleBadge();
  }

  function renderSidebar() {
    const holder = document.getElementById('sidebar');
    if (!holder) return;
    const role = currentRole();
    const active = document.body.dataset.active || '';
    let html = `
      <div class="px-5 py-5 flex items-center gap-2 border-b border-slate-800">
        <span class="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">E</span>
        <div>
          <div class="text-white font-semibold leading-tight">EduCentre</div>
          <div class="text-[11px] text-slate-400 leading-tight">School Management</div>
        </div>
      </div>
      <nav class="flex-1 overflow-y-auto py-3">`;
    let pendingSection = null;
    NAV.forEach((item) => {
      if (item.section) { pendingSection = item.section; return; }
      if (!item.roles.includes(role)) return;
      if (pendingSection) {
        html += `<div class="px-5 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">${pendingSection}</div>`;
        pendingSection = null;
      }
      const isActive = item.href.replace('.html', '') === active;
      html += `
        <a href="${item.href}" class="mx-2 mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
          isActive
            ? 'bg-indigo-500/15 text-white font-medium border-l-2 border-indigo-400'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }">
          <span class="text-base leading-none">${item.icon}</span>${item.label}
        </a>`;
    });
    html += `</nav>
      <div class="p-4 border-t border-slate-800">
        <a href="../portal/home.html" class="block text-center text-xs rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 px-3 py-2">
          📱 View Student / Parent Portal
        </a>
        <a href="../index.html" class="mt-2 block text-center text-xs text-slate-500 hover:text-slate-300">Sign out</a>
      </div>`;
    holder.innerHTML = html;
  }

  function renderTopbar() {
    const holder = document.getElementById('topbar');
    if (!holder) return;
    const title = document.body.dataset.title || '';
    const subtitle = document.body.dataset.subtitle || '';
    holder.innerHTML = `
      <div class="flex items-center justify-between gap-4 px-6 py-3.5 bg-white border-b border-slate-200">
        <div>
          <h1 class="text-lg font-semibold text-slate-900">${title}</h1>
          ${subtitle ? `<p class="text-xs text-slate-500">${subtitle}</p>` : ''}
        </div>
        <div class="flex items-center gap-3">
          <select class="text-sm border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700" onchange="proto.toast('Branch filter is visual only in this prototype')">
            <option>All branches</option>
            <option>Bukit Timah Centre</option>
            <option>Tampines Centre</option>
            <option>Woodlands Centre</option>
          </select>
          <select id="role-switcher" class="text-sm border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700">
            <option value="super">Super Admin</option>
            <option value="manager">Branch Manager</option>
            <option value="teacher">Teacher</option>
          </select>
          <span id="role-badge" class="hidden sm:inline-flex text-[11px] font-medium px-2 py-1 rounded-full"></span>
          <span class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">JT</span>
        </div>
      </div>`;
    const sw = document.getElementById('role-switcher');
    sw.value = currentRole();
    sw.addEventListener('change', (e) => {
      setRole(e.target.value);
      proto.toast('Viewing as ' + ROLES[e.target.value].label + ' — menu updated');
    });
    renderRoleBadge();
  }

  function renderRoleBadge() {
    const el = document.getElementById('role-badge');
    if (!el) return;
    const r = ROLES[currentRole()];
    el.className = 'hidden sm:inline-flex text-[11px] font-medium px-2 py-1 rounded-full ' + r.badge;
    el.textContent = r.label;
  }

  /* ---- tabs: <button data-tab="x"> shows <section data-panel="x"> ---- */
  function initTabs() {
    document.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const group = btn.closest('[data-tabgroup]') || document;
        group.querySelectorAll('[data-tab]').forEach((b) => {
          b.classList.remove('border-indigo-500', 'text-indigo-600', 'bg-indigo-50');
          b.classList.add('border-transparent', 'text-slate-500');
        });
        btn.classList.add('border-indigo-500', 'text-indigo-600', 'bg-indigo-50');
        btn.classList.remove('border-transparent', 'text-slate-500');
        group.querySelectorAll('[data-panel]').forEach((p) => {
          p.classList.toggle('hidden', p.dataset.panel !== btn.dataset.tab);
        });
      });
    });
  }

  /* ---- segmented attendance buttons ---- */
  function initSegments() {
    document.querySelectorAll('[data-seg]').forEach((row) => {
      row.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          row.querySelectorAll('button').forEach((b) => {
            b.className = 'px-2.5 py-1 text-xs rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50';
          });
          const map = {
            Present: 'px-2.5 py-1 text-xs rounded-md border border-emerald-600 bg-emerald-600 text-white font-medium',
            Late:    'px-2.5 py-1 text-xs rounded-md border border-amber-500 bg-amber-500 text-white font-medium',
            Absent:  'px-2.5 py-1 text-xs rounded-md border border-rose-600 bg-rose-600 text-white font-medium',
          };
          btn.className = map[btn.textContent.trim()] || map.Present;
        });
      });
    });
  }

  /* ---- prototype toast ---- */
  window.proto = {
    toast(msg) {
      let t = document.getElementById('proto-toast');
      if (!t) {
        t = document.createElement('div');
        t.id = 'proto-toast';
        t.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg transition-opacity duration-300 opacity-0 pointer-events-none max-w-md text-center';
        document.body.appendChild(t);
      }
      t.textContent = msg || 'Prototype only — this action is not wired up';
      t.classList.remove('opacity-0');
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.add('opacity-0'), 2200);
    },
    stub(e) {
      if (e && e.preventDefault) e.preventDefault();
      window.proto.toast();
      return false;
    },
    setRole,
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    renderTopbar();
    initTabs();
    initSegments();
    document.querySelectorAll('form[data-proto]').forEach((f) =>
      f.addEventListener('submit', window.proto.stub)
    );
  });
})();
