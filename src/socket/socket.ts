import EventEmitter from 'events'
export class SocketImpl implements Socket {
    private ws!: WebSocket;

    constructor(url: string, emitter: EventEmitter) {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
            emitter.emit('open');
        }
        this.ws.onmessage = (ev: MessageEvent) => {
            emitter.emit('data', ev.data);
        }
        this.ws.onclose = () => {
            emitter.emit('close');
        }
        this.ws.onerror = () => {
            emitter.emit('error');
        }
    }

    public send(data: string | ArrayBuffer): void {
        this.ws.send(data);
    }

    public close(code?: number | undefined, reason?: string | undefined): void {
        this.ws.close(code, reason);
    }
}