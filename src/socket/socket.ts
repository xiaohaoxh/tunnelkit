import Utils from "../utils/Utils";

export class SocketManager {

}

export class SocketImpl {
    private websocket: WebSocket;
    private lastSendTime: number;
    private lastReceivedTime: number;

    constructor(url: string, callback: SocketCallback) {
        this.websocket = new WebSocket(url);
        this.websocket!.onopen = () => {
            callback!.onOpen();
        };
        this.websocket!.onmessage = (ev: MessageEvent) => {
            callback!.onMessage(ev.data);
        };
        this.websocket!.onclose = () => {
            callback!.onClose();
        };
        this.websocket!.onerror = () => {
            callback!.onError();
        };
    }

    public ping(): void {

    }

    public send(data: string | ArrayBuffer) {
        this.lastReceivedTime = Utils.timestamp();
        this.websocket.send(data);
    }

    public close(code?: number, reason?: string): void {
        this.websocket!.close(code, reason);
    }
}

interface SocketCallback {
    onMessage(data: string | ArrayBuffer);
    onOpen(): void;
    onClose(): void;
    onError(): void;
}