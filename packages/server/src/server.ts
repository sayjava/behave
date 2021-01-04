import cors from 'cors';
import express, { Express } from 'express';
import morgan from 'morgan';
import behaveHandler from './handlers/';

export interface ServerConfig {
    port?: number;
    fromFile?: string;
    behaviors?: Array<any>;
    healthCheck?: string;
    readyCheck?: string;
    debug?: 'none' | 'verbose';
}

const defaultConfig: ServerConfig = {
    port: 8_080,
    healthCheck: '/_/healthz',
    readyCheck: '/_/readyz',
    debug: 'none',
};

function createKeepAliveRoute(app: Express, path: string) {
    app.get(path, (req, res) => {
        res.status(200).send('Ok');
    });
}

function enableLogging(app: Express, config: ServerConfig) {
    switch (config.debug) {
        case 'none':
            break;
        case 'verbose': {
            app.use(
                morgan('combined', {
                    skip: (req, _) => req.path.includes('/_ui/'),
                }),
            );
            break;
        }
    }
}

function enableUI(app: Express) {
    app.use('/_ui/', express.static('public'));
}

export default async (argConfig: ServerConfig) => {
    const config = Object.assign({}, defaultConfig, argConfig);

    const app = express();
    app.use(cors());

    enableUI(app);
    enableLogging(app, config);

    createKeepAliveRoute(app, config.healthCheck);
    createKeepAliveRoute(app, config.readyCheck);

    app.use(behaveHandler({ config: argConfig }));

    return {
        app,
        start: async () => {
            app.listen(config.port, () => {
                console.info(`behave Server started on ${config.port}`);
            });
        },
        stop: () => {
            console.info('Stop the server');
        },
    };
};
