const WS_URL = 'ws://localhost:8080';

export function setupWebSocketMonitor(textarea: HTMLTextAreaElement) {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'auth', password: 'password' }));
    };

    ws.onmessage = (event) => {
        textarea.value += event.data + '\n';
        textarea.scrollTop = textarea.scrollHeight;
    };

    ws.onclose = () => {
        textarea.value += '[Connection closed]\n';
    };

    window.addEventListener('beforeunload', () => ws.close());
}