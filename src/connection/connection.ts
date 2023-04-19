import Utils from "../utils/Utils";
import { SocketImpl } from "../socket/socket";

export default class ConnectionManager {
    private connectionPool: Set<Connection>;
    private tunnel: Tunnel;
    private config: TunnelConfig;
    private addressDelegate: AddressDelegate;

    constructor(tunnel: Tunnel, config: TunnelConfig, addressDelegate: AddressDelegate) {
        this.connectionPool = new Set();
        this.tunnel = tunnel;
        this.config = config;
        this.addressDelegate = addressDelegate;
    }

    public startRacing(): void {
    }

    private addConnection(connection: Connection): void {
        if (this.connectionPool.size < this.config.maxConnectionCount) {
            this.connectionPool.add(connection);
        }
    }

    private removeConnection(connection: Connection): void {
        this.connectionPool.delete(connection);
    }

    private reconnect(): void {

    }

}

class ConnectionImpl implements Connection {

    private url!: string;
    private config!: ConnectionConfig;
    private socket!: SocketImpl;
    private lastSendTime!: number;
    private lastReceivedTime!: number;

    constructor(url: string, config: ConnectionConfig) {
        this.url = url;
        this.config = config;
    }

    connect(): void {
        let that = this;
        this.socket = new SocketImpl(this.url);
        let callback: SocketCallback = {
            onOpen() {
                that.onConnect();
            },
            onMessage(data) {
                that.onMessage(data);
            },
            onClose() {
                that.onClose();
            },
            onError() {
                that.onError();
            }
        }
        this.socket.setCallback(callback);
    }

    close(): void {
        this.socket.close();
    }

    send(data: string | ArrayBuffer): void {
        this.lastSendTime = Utils.timestamp();
        this.socket.send(data);
    }

    ping(): void {
        if (Utils.timestamp() - this.lastReceivedTime >= this.config.headbeatIntervals) {
            this.send(new ArrayBuffer(1));
        }
    }

    onConnect(): void {
        
    }

    onClose(): void {
        
    }

    onMessage(data: string | ArrayBuffer): void {
        this.lastReceivedTime = Utils.timestamp();
    }

    onError(): void {
        
    }
}