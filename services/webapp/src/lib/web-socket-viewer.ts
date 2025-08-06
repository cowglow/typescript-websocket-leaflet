import { AUTHENTICATION, WS_URL } from "../constants.ts";
import { WebSocketClient } from "../infrastructure/WebSocketClient.ts";

export function createWebSocketViewer() {
	const textarea = document.createElement("textarea");
	textarea.readOnly = true;
	textarea.rows = 6;
	setupWebSocketMonitor(textarea);
	return textarea;
}

function setupWebSocketMonitor(textarea: HTMLTextAreaElement) {
	const ws = new WebSocketClient(WS_URL);

	ws.connect(() => ws.send(JSON.stringify(AUTHENTICATION)));

	ws.onMessage((message: string) => {
		console.log(message);
		textarea.value += `${message}\n`;
		textarea.scrollTop = textarea.scrollHeight;
	});

	ws.onClose(() => (textarea.value += "[Connection closed]\n"));

	window.addEventListener("beforeunload", () => ws.close());
}
