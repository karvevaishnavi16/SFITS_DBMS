// SFITS Theme Toggle — shared across all pages
(function() {
  const saved = localStorage.getItem('sfits-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('sfits-theme', next);
}

// Inject toggle button when DOM ready
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.onclick = toggleTheme;
  btn.setAttribute('title', 'Toggle Light/Dark Mode');
  btn.innerHTML = '<span class="icon-sun">☀️</span><span class="icon-moon">🌙</span>';
  document.body.appendChild(btn);
});
