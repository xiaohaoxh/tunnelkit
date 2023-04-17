export default class TunnelKit implements TunnelKitImpl {

    constructor(address: AddressDelegate) {

    }

    public start(): void {

    }

    public close(): void {

    }
}

interface AddressDelegate {
    getAddress(): string[]
}

interface TunnelKitImpl {
    start(): void;
    close(): void;
}