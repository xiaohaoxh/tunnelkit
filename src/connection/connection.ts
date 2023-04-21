import Utils from "../utils/Utils";
import TunnelKit from "../core/tunnelkit";
import { SocketImpl } from "../socket/socket";
import EventEmitter from "events";
import Logger from "../log/Logger";

export default class ConnectionManager {
    private readonly TAG: string = 'ConnectionManager';
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
        let promises: Promise<ConnectionImpl>[] = [];
        urls.forEach(url => {
            const promise: Promise<ConnectionImpl> = new Promise<ConnectionImpl>((resolve, reject) => {
                const connectionConfig = this.tunnel.getConfig().connectionConfig;
                const emitter = new EventEmitter();
                const connection: ConnectionImpl = new ConnectionImpl(url, connectionConfig, emitter);
                emitter.on('open', _ => {
                    resolve(connection);
                });
                emitter.on('data', _ => {

                });
                emitter.on('close', _ => {
                    reject(connection);
                });
                emitter.on('error', _ => {

                });
                connection.connect();
                
            }).then(connection => {
                this.addConnection(connection);
                return connection;
            }).catch(connection => {
                return connection;
            });
            promises.push(promise);
        })
        Promise.all(promises).then(connecitons => {

        }).catch(connections => {

        }).finally(() => {
            Logger.debug(this.TAG, 'racing complete.');
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
    private emitter!: EventEmitter;

    constructor(url: string, config: ConnectionConfig, emitter: EventEmitter) {
        this.url = url;
        this.config = config;
        this.emitter = emitter;
    }

    connect(): void {
        let that = this;
        this.socket = new SocketImpl(this.url, this.emitter);
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
}

