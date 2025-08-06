interface IWebSocketClient {
	connect(callback: () => void): void;
	send(message: string): void;
	onMessage(callback: (message: string) => void): void;
	onClose(callback: () => void): void;
	close(): void;
}

export class WebSocketClient implements IWebSocketClient {
	private ws: WebSocket | null = null;
	private url: string;
	private messageCallback: ((message: string) => void) | null = null;
	private closeCallback: (() => void) | null = null;

	constructor(url: string) {
		this.url = url;
	}

	connect(callback: () => void): void {
		if (this.ws) return;
		this.ws = new WebSocket(this.url);

		this.ws.onopen = () => {
			callback();
		};

		this.ws.onmessage = (event) => {
			if (this.messageCallback) {
				this.messageCallback(event.data);
			}
		};

		this.ws.onclose = () => {
			if (this.closeCallback) {
				this.closeCallback();
			}
			this.ws = null;
		};
	}

	send(message: string): void {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(message);
		}
	}

	onMessage(callback: (message: string) => void): void {
		this.messageCallback = callback;
	}

	onClose(callback: () => void): void {
		this.closeCallback = callback;
	}

	close(): void {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}
}
