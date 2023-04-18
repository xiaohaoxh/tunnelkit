interface Tunnel {
    start(): void;
    stop(): void;
    onMessage(data: string | ArrayBuffer);
    onClose(): void;
}

interface Socket {
    write(data: string | ArrayBuffer): void;
    close(code?: number, reason?: string): void;
    setCallback(callback: SocketCallback): void;
}

interface SocketCallback {
    onOpen(): void;
    onMessage(data: string | ArrayBuffer);
    onClose(): void;
}

interface ConnectionCore {
    ping(): void;
}

interface AddressDelegate {
    getAddresses(): string[];
}