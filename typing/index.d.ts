interface Tunnel {
    start(): void;
    stop(): void;
    onMessage(data: string | ArrayBuffer);
    onClose(): void;
}

interface Socket {
    send(data: string | ArrayBuffer): void;
    close(code?: number, reason?: string): void;
}

interface SocketCallback {
    onOpen(): void;
    onMessage(data: string | ArrayBuffer);
    onClose(): void;
    onError(): void;
}

interface ConnectionCore {
    ping(): void;
}

interface AddressDelegate {
    getAddresses(): string[];
}

interface Connection {

    connect(): void;

    close(): void;

    send(data: string | ArrayBuffer): void;

    ping(): void;
    
    onConnect(): void;

    onMessage(data: string | ArrayBuffer): void;

    onClose(): void;

    onError(): void;

}