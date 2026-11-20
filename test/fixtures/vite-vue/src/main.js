import { createApp, h } from 'vue';
import './style.css';

createApp({ render: () => h('div', { id: 'probe', class: 'bg-background text-foreground rounded-md font-sans' }, 'probe') }).mount('#app');
