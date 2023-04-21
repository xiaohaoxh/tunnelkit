interface Tunnel {
    start(): void;
    stop(): void;
    onOpen(): void;
    onMessage(data: string | ArrayBuffer);
    onClose(): void;
    onError(): void;
}

interface Socket {
    send(data: string | ArrayBuffer): void;
    close(code?: number, reason?: string): void;
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
}