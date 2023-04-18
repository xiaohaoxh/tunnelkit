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
        let that = this;
        new Promise((resolve, reject) => {
            const urls: string[] = this.addressDelegate.getAddresses();
            urls.forEach(url => {
                const connection = new Connection(url);

                let callback: SocketCallback = {
                    onOpen() {
                        resolve(connection);
                    },
                    onMessage(data) {
                        that.tunnel.onMessage(data);
                    },
                    onClose() {
                        that.tunnel.onClose();
                        that.reconnect();
                    }
                }
                connection.setCallback(callback);
            })
        }).then(res => {
            this.addConnection(res as unknown as Connection);
        })
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

class Connection {

    private connection!: SocketImpl;
    private lastWriteTime: number;

    constructor(url: string) {
        this.connection = new SocketImpl(url);
    }

    public ping() {

    }

    public setCallback(callback: SocketCallback): void {
        this.connection.setCallback(callback);
    }

    public write(data: string | ArrayBuffer): void {
        this.lastWriteTime = Utils.timestamp();
        this.connection.write(data);
    }
}