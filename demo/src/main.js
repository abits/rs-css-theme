import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import './style.css';

const root = document.documentElement;
const buttons = document.querySelectorAll('[data-set-mode]');

function setMode(mode) {
  if (mode === 'system') root.removeAttribute('data-mode');
  else root.dataset.mode = mode;
  buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.setMode === mode)));
}

buttons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.setMode)));
