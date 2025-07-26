import './style.css';
import { setupWebSocketMonitor } from './websocket-monitor';

const textarea = document.createElement('textarea');
textarea.readOnly = true;
textarea.style.width = '100%';
textarea.style.height = '300px';
textarea.style.fontFamily = 'monospace';
document.getElementById("app")?.appendChild(textarea);

setupWebSocketMonitor(textarea);