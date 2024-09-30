import os from 'os'
import config from '../config/config'

export default {
    getSystemHealth: () => {
        return {
            cpuUsage: os.loadavg(),
            totalmemory: `${os.totalmem() / 1024 / 1024} MB`,
            freeMemory: `${os.freemem() / 1024 / 1024} MB`
        }
    },
    getApplicationHealth: () => {
        return {
            environment: config.ENV,
            uptime: `${process.uptime().toFixed(2)} Second`,
            memoryUsage: {
                heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed()} MB`,
                heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed()} MB`
            }
        }
    }
}

