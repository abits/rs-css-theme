import { createElement as el } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

createRoot(document.getElementById('root')).render(
  el('div', { id: 'probe', className: 'bg-background text-foreground rounded-md font-sans' },
    'probe',
    el('p', { id: 'probe-muted', className: 'text-muted' }, 'muted'),
    el('p', { id: 'probe-accent', className: 'bg-accent text-accent-foreground rounded-lg font-mono' }, 'accent'),
    el('p', { id: 'probe-sm', className: 'rounded-sm border border-border' }, 'small'),
  ),
);
