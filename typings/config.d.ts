declare type TunnelConfig =  {
    maxConnectionCount: number,
    connectionConfig: ConnectionConfig
}

declare type ConnectionConfig = {
    heartbeatIntervals: number
}

export {
    TunnelConfig, ConnectionConfig
}