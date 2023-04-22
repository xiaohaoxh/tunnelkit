import Utils from "../utils/Utils";
import TunnelKit from "../core/tunnelkit";
import { SocketImpl } from "../socket/socket";
import EventEmitter from "events";
import Logger from "../log/Logger";

export default class ConnectionManager {
    private readonly TAG: string = 'ConnectionManager';
    private connectionPool: Map<string, Connection>;
    private racingConnections: Connection[];
    private tunnel!: TunnelKit;
    private config!: TunnelConfig;
    private addresses!: string[];

    constructor(tunnel: TunnelKit, config: TunnelConfig, addresses: string[]) {
        this.connectionPool = new Map();
        this.racingConnections = [];
        this.tunnel = tunnel;
        this.config = config;
        this.addresses = addresses;
    }

    public startRacing(): void {
        if (this.connectionPool.size >= this.config.maxConnectionCount) {
            return;
        }
        const that = this;
        const urls = this.filterUrls(this.addresses);
        let promises: Promise<Connection>[] = [];
        urls.forEach(url => {
            const promise: Promise<Connection> = new Promise<Connection>((resolve, reject) => {
                const connectionConfig = this.tunnel.getConfig().connectionConfig;
                const emitter = new EventEmitter();
                const connection: Connection= new Connection(url, connectionConfig, emitter);
                emitter.on('open', _ => {
                    this.addConnection(connection);
                });
                emitter.on('data', data => {
                    this.tunnel.onMessage(data);
                });
                emitter.on('close', _ => {
                    this.removeConnection(connection);
                    this.tryReconnect();
                });
                emitter.on('error', _ => {
                    this.tunnel.onError();
                });
                connection.connect();
                
            });
            promises.push(promise);
        })

        Promise.all(promises).finally(() => {
            Logger.debug(this.TAG, 'racing complete.');
            this.racingComplete();
        })
    }

    private filterUrls(urls: string[]): string[] {
        const result: string[] = [];
        urls.forEach(url => {
            if (!this.connectionPool.has(url)) {
                result.push(url);
            }
        })
        return result;
    }

    private racingComplete(): void {
        if (this.connectionPool.size < this.config.maxConnectionCount) {
            this.startRacing();
        } else {
            this.racingConnections.forEach(connection => {
                connection.close();
            })
            this.racingConnections = [];
        }
    }

    private addConnection(connection: Connection): void {
        if (this.connectionPool.size === 0) {
            this.tunnel.onOpen();
        }
        if (this.connectionPool.size <= this.config.maxConnectionCount) {
            this.connectionPool.set(connection.url, connection);
        } else {
            this.racingConnections.push(connection);
        }
    }

    private removeConnection(connection: Connection): void {
        this.connectionPool.delete(connection.url);
        if (this.connectionPool.size === 0) {
            this.tunnel.onClose();
        }
    }

    private tryReconnect(): void {
        if (this.connectionPool.size < this.config.maxConnectionCount) {
            Utils.scheme(this.startRacing, 1000);
        }
    }

    public send(data: string | ArrayBuffer): void {

    }



}

class Connection {
    private tag: string = 'Connection';
    public url!: string;
    private config!: ConnectionConfig;
    private socket!: SocketImpl;
    private emitter!: EventEmitter;
    private heartbeatTask!: number;
    private pingTimeout!: number;

    constructor(url: string, config: ConnectionConfig, emitter: EventEmitter) {
        this.url = url;
        this.config = config;
        this.emitter = emitter;
        this.emitter.on('open', () => {
            this.ping();
        })
        this.emitter.on('data', data => {
            if (this.isPong(data)) {
                clearInterval(this.pingTimeout);
            }
            this.resetHeartBeatTask();
        })
    }

    connect(): void {
        let that = this;
        this.socket = new SocketImpl(this.url, this.emitter);
    }

    close(): void {
        this.socket.close();
    }

    send(data: string | ArrayBuffer): void {
        this.socket.send(data);
    }

    ping(): void {
        this.send(new ArrayBuffer(1));
        this.pingTimeout = setTimeout(() => {
            Logger.debug(this.tag, 'ping timeout.');
            this.close();
        }, this.config.heartbeatIntervals);
    }

    private isPong(data: ArrayBuffer): boolean {
        if (data.byteLength === 1) {
            return true;
        } else {
            return false;
        }
    }

    private resetHeartBeatTask(): void {
        clearTimeout(this.heartbeatTask);
        this.heartbeatTask = setTimeout(() => {
            this.ping();
        }, this.config.heartbeatIntervals);
    }
}

