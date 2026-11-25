// Small progressive enhancements: theme, language, start menu, clock, minimize.
(function () {
  var root = document.documentElement;
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // ---- Theme (Display Properties) ----
  var display = document.getElementById('display');
  var radios = display.querySelectorAll('input[name="theme"]');
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  function setTheme(t) {
    root.dataset.theme = t;
    save('theme', t);
    radios.forEach(function (r) { r.checked = r.value === t; });
    metaTheme.setAttribute('content', t === 'luna' ? '#0a5ae8' : '#16181c');
  }
  setTheme(root.dataset.theme === 'luna' ? 'luna' : 'noir');
  radios.forEach(function (r) {
    r.addEventListener('change', function () { setTheme(r.value); });
  });
  function openDisplay() {
    closeStart();
    display.hidden = false;
    display.querySelector('input:checked').focus();
  }
  function closeDisplay() { display.hidden = true; }
  document.querySelectorAll('[data-open-display]').forEach(function (b) {
    b.addEventListener('click', function () { display.hidden ? openDisplay() : closeDisplay(); });
  });
  document.querySelectorAll('[data-close-display]').forEach(function (b) {
    b.addEventListener('click', closeDisplay);
  });

  // ---- Language ----
  document.getElementById('lang').addEventListener('click', function () {
    var l = root.lang === 'pt' ? 'en' : 'pt';
    root.lang = l;
    save('lang', l);
  });

  // ---- Start menu ----
  var start = document.getElementById('start');
  var menu = document.getElementById('startmenu');
  function closeStart() { menu.hidden = true; start.setAttribute('aria-expanded', 'false'); }
  start.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = menu.hidden;
    closeDisplay();
    menu.hidden = !open;
    start.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('a').focus();
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeStart(); });
  document.addEventListener('click', function (e) {
    if (!menu.hidden && !menu.contains(e.target)) closeStart();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!menu.hidden) { closeStart(); start.focus(); }
      if (!display.hidden) closeDisplay();
    }
  });

  // ---- Minimize buttons collapse a window ----
  document.querySelectorAll('.titlebar .b-min').forEach(function (b) {
    if (b.tagName !== 'BUTTON') return;
    b.setAttribute('aria-expanded', 'true');
    b.addEventListener('click', function () {
      var w = b.closest('.window');
      var min = w.classList.toggle('minimized');
      b.setAttribute('aria-expanded', String(!min));
      b.setAttribute('aria-label', min ? 'Restore' : 'Minimize');
    });
  });

  // ---- Clock ----
  var clock = document.getElementById('clock');
  function tick() {
    var d = new Date();
    clock.textContent = d.toLocaleTimeString(root.lang === 'pt' ? 'pt-BR' : 'en-US', { hour: 'numeric', minute: '2-digit' });
  }
  tick();
  setInterval(tick, 20000);
})();
