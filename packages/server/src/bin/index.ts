#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import server from '../server';

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
    })
    .option('debug', {
        alias: 'd',
        describe: 'Debug level info, verbose',
        default: 'info',
    }).argv;

try {
    if (args.behaviors) {
        Object.assign(args, { behaviors: JSON.parse(args.behaviors) });
    }
    server({
        ...(args as any),
    }).then((app) => app.start());
} catch (error) {
    console.error(error);
    process.exit(-1);
}
