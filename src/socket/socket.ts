export class SocketImpl implements Socket {
    private ws!: WebSocket;
    private callback!: SocketCallback;

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
            this.callback && this.callback.onOpen();
        }
        this.ws.onmessage = (ev: MessageEvent) => {
            this.callback && this.callback.onMessage(ev.data);
        }
        this.ws.onclose = () => {
            this.callback && this.callback.onClose();
        }
        this.ws.onerror = () => {
            this.callback && this.callback.onError();
        }
    }

    public send(data: string | ArrayBuffer): void {
        this.ws.send(data);
    }

    public close(code?: number | undefined, reason?: string | undefined): void {
        this.ws.close(code, reason);
    }

    public setCallback(callback: SocketCallback): void {
        this.callback = callback;
    }
}