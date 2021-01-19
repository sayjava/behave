import { createLogger, format, transports } from 'winston';

const getLogLevel = () => {
    if(process.env.NODE_ENV === "test") {
        return "error"
    }

    return process.env.LOG_LEVEL || "info"
}

export default createLogger({
    level: getLogLevel(),
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    ),
    defaultMeta: { service: 'behavior-server' },
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
        }),
    ],
});

