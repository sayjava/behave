import { createLogger, format, transports } from 'winston';

export default createLogger({
    silent: process.env.NODE_ENV === "test",
    level: process.env.LOG_LEVEL || "info",
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

