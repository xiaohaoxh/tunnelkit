type TunnelConfig =  {
    maxConnectionCount: number,
    connectionConfig: ConnectionConfig
}

type ConnectionConfig = {
    heartbeatIntervals: number
}