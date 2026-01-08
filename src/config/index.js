const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
    development: {
        baseApi: 'http://192.168.1.127:1001',
        mockApi: 'http://192.168.1.127:1001',
    },
    test: {
        baseApi: 'http://192.168.1.127:1001',
        mockApi: 'http://192.168.1.127:1001',
    },
    prod: {
        baseApi: 'http://192.168.1.127:1001',
        mockApi: 'http://192.168.1.127:1001',
    },
}

export default {
    env,
    mock: true,
    ...EnvConfig[env],
}
