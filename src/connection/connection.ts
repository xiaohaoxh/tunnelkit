import Utils from "../utils/Utils";
import TunnelKit from "../core/tunnelkit";
import { SocketImpl } from "../socket/socket";

export default class ConnectionManager {
    private connectionPool: Set<Connection>;
    private tunnel!: TunnelKit;
    private config!: TunnelConfig;
    private addressDelegate!: AddressDelegate;

    constructor(tunnel: TunnelKit, config: TunnelConfig, addressDelegate: AddressDelegate) {
        this.connectionPool = new Set();
        this.tunnel = tunnel;
        this.config = config;
        this.addressDelegate = addressDelegate;
    }

    public startRacing(): void {
        const that = this;
        const urls: string[] = this.addressDelegate.getAddresses();
        urls.forEach(url => {
            new Promise((resolve, reject) => {
                const connectionConfig = this.tunnel.getConfig().connectionConfig;
                const connection: ConnectionImpl = new ConnectionImpl(url, connectionConfig);
                const callback: SocketCallback = {
                    onOpen() {
                        resolve(connection);
                    },
                    onClose() {
                        reject(connection);
                    },
                    onMessage(data) {
                        
                    },
                    onError() {
                        reject(connection);
                    },
                }
                connection.setCallback(callback);
                connection.connect();
                
            }).then(connection => {
                this.addConnection(connection as unknown as Connection);
            }).catch(connection => {
                this.removeConnection(connection as unknown as Connection);
                this.reconnect();
            })
        })
    }

    private addConnection(connection: Connection): void {
        if (this.connectionPool.size <= this.config.maxConnectionCount) {
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
    private callback!: SocketCallback;

    constructor(url: string, config: ConnectionConfig) {
        this.url = url;
        this.config = config;
    }

    connect(): void {
        let that = this;
        this.socket = new SocketImpl(this.url);
        let callback: SocketCallback = {
            onOpen() {
                that.callback.onOpen();
            },
            onMessage(data) {
                that.callback.onMessage(data);
            },
            onClose() {
                that.callback.onClose();
            },
            onError() {
                that.callback.onError();
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
        if (Utils.timestamp() - this.lastReceivedTime >= this.config.heartbeatIntervals) {
            this.send(new ArrayBuffer(1));
        }
    }

    setCallback(callback: SocketCallback): void {
        this.callback = callback;
    }

}

