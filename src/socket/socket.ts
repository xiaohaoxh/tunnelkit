export class SocketImpl implements Socket {
    private ws!: WebSocket;
    private callback!: SocketCallback;

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
            if (this.callback) {
                this.callback.onOpen();
            }
        }
        this.ws.onmessage= (ev: MessageEvent) => {
            if (this.callback) {
                this.callback.onMessage(ev.data);
            }
        }
    }

    public write(data: string | ArrayBuffer): void {
        this.ws.send(data);
    }

    public close(code?: number | undefined, reason?: string | undefined): void {
        this.ws.close(code, reason);
    }

    public setCallback(callback: SocketCallback): void {
        this.callback = callback;
    }
}