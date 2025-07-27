import { AUTHENTICATION, WS_URL } from "../constants.ts";

export function createWebSocketViewer() {
	const textarea = document.createElement("textarea");
	textarea.readOnly = true;
	setupWebSocketMonitor(textarea);
	return textarea;
}

function setupWebSocketMonitor(textarea: HTMLTextAreaElement) {
	const ws = new WebSocket(WS_URL);

	ws.onopen = () => ws.send(JSON.stringify(AUTHENTICATION));

	ws.onmessage = (event) => {
		textarea.value += event.data + "\n";
		textarea.scrollTop = textarea.scrollHeight;
	};

	ws.onclose = () => (textarea.value += "[Connection closed]\n");

	window.addEventListener("beforeunload", () => ws.close());
}
