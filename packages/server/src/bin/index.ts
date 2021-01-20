#!/usr/bin/env node
import Table from 'cli-table';
import { existsSync, watchFile } from 'fs';
import os from 'os';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import server from '../server';
import logger from "../logger"

const logInfo = (config) => {
    const {
        eth0 = [
            {
                family: 'IPv4',
                address: 'localhost',
            },
        ],
    } = os.networkInterfaces();

    console.info(`|------ Behave Server Started on port ${config.port} ------- |`);
    console.info(`|------ Available urls on the server are:  ------- |`);

    const routes = [
        ['List Behaviors', '/_/api/behaviors'],
        ['List Records', '/_/api/records'],
        ['Assert Request Sequence', '/_/api/sequence'],
        ['Assert Requests Existences & Counts', '/_/api/requests/assert'],
        ['Reset Server', '/_/api/reset'],
    ];

    eth0.forEach((it) => {
        if (it.family === 'IPv4') {
            const table = new Table({ head: ['Description', 'Url'] });

            routes.forEach(([desc, url]) => {
                table.push([desc, `http://${it.address}:${config.port}${url}`]);
            });

            console.info(table.toString());
        }
    });
};

const args = yargs(hideBin(process.argv))
    .option('behaviors', {
        alias: 'b',
        describe: 'initialize the server with this behavior',
        default: null,
    })
    .option('port', {
        alias: 'p',
        describe: 'server port',
        default: 8_080,
    })
    .option('healthCheck', {
        alias: 'he',
        describe: 'Health check path',
        default: '/_/healthz',
    })
    .option('readyCheck', {
        alias: 're',
        describe: 'Ready check path',
        default: '/_/readyz',
    })
    .option('from-file', {
        alias: 'f',
        describe: 'JSON file containing array of behaviors',
        default: 'behaviors.json',
    })
    .option('open-api', {
        alias: 'a',
        describe: 'Open API file',
    }).argv;

const startServer = async () => {
    let app = await server({ ...(args as any) });
    app.start();
    logInfo(args);
    return app;
};

const start = async () => {
    try {
        
        if (args.behaviors) {
            Object.assign(args, { behaviors: JSON.parse(args.behaviors) });
        }
        
        let serverApp = await startServer();
        
        const behaviorFile = path.join(process.cwd(), args['from-file']);
        if (existsSync(behaviorFile)) {
            watchFile(behaviorFile, async () => {
                try {
                    logger.info(`${behaviorFile} has changed and restarting the server`)
                    serverApp.stop();
                    serverApp = await startServer();
                } catch (error) {
                    logger.error(error);
                    process.exit(-1);
                }
            });
        }
    } catch (error) {
        logger.error(error);
        process.exit(-1);
    }
};

start();
