import ConnectionManager from "../connection/connection";
import { TunnelConfig } from "../../typings/config";

export default class TunnelKit {
    private config!: TunnelConfig;
    private connectionManager: ConnectionManager;

    constructor(config: TunnelConfig) {
        this.config = config;
        this.connectionManager = new ConnectionManager(this, config, ['ws://localhost:8000']);
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