import ConnectionManager from "../connection/connection";

export default class TunnelKit {
    private config!: TunnelConfig;
    private connectionManager: ConnectionManager;

    constructor(config: TunnelConfig) {
        this.config = config;
        this.connectionManager = new ConnectionManager(this, config, []);
    }

    start(): void {
        this.connectionManager.startRacing();
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