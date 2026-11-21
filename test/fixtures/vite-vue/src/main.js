import { createApp, h } from 'vue';
import './style.css';

const probe = () =>
  h('div', { id: 'probe', class: 'bg-background text-foreground rounded-md font-sans' }, [
    'probe',
    h('p', { id: 'probe-muted', class: 'text-muted' }, 'muted'),
    h('p', { id: 'probe-accent', class: 'bg-accent text-accent-foreground rounded-lg font-mono' }, 'accent'),
    h('p', { id: 'probe-sm', class: 'rounded-sm border border-border' }, 'small'),
  ]);

createApp({ render: probe }).mount('#app');
