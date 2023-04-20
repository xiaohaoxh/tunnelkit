export default class TunnelKit implements Tunnel {
    private config!: TunnelConfig;

    constructor(config: TunnelConfig) {
        this.config = config;
    }

    start(): void {
        
    }

    stop(): void {
        
    }

    onOpen(): void {
        
    }

    onMessage(data: string | ArrayBuffer) {
        
    }

    onClose(): void {
        
    }

    onError(): void {
        
    }

    getConfig(): TunnelConfig {
        return this.config;
    }

}