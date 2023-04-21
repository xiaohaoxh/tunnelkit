const defaultConnectionConfig: ConnectionConfig = {
    heartbeatIntervals: 30
};

const defaultTnnelConfig: TunnelConfig = {
    maxConnectionCount: 5,
    connectionConfig: defaultConnectionConfig
};

export { defaultTnnelConfig };