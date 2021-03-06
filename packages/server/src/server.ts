import cors from 'cors';
import express, { Express } from 'express';
import behaveHandler from './handlers/';
import logger from './logger';
import openAPI from './open_api';
import morgan from 'morgan';
import { Behavior } from '@sayjava/behave-engine';

export interface ServerConfig {
    port?: number;
    fromFile?: string;
    openApi?: string;
    behaviors?: Array<Behavior>;
    healthCheck?: string;
    readyCheck?: string;
}

const defaultConfig: ServerConfig = {
    port: 8080,
    healthCheck: '/_/healthz',
    readyCheck: '/_/readyz',
    fromFile: 'behaviors.json',
};

const createKeepAliveRoute = (app: Express, path: string) => {
    app.get(path, (req, res) => {
        res.status(200).send('Ok');
    });
};

const enableLogging = (app: Express) => {
    if (process.env.NODE_ENV !== 'test') {
        app.use(
            morgan('common', {
                skip: (req) => req.path.includes('/_/'),
            }),
        );
    }
};

const enableUI = (app: Express) => {
    const prefix = process.env.NODE_ENV !== 'production' ? '../../' : '';
    app.use('/_ui/', express.static(`${prefix}node_modules/@sayjava/behave-ui/public`));
};

const loadOpenAPI = async (config: ServerConfig): Promise<ServerConfig> => {
    if (config.openApi) {
        try {
            const behaviors = await openAPI({ uri: config.openApi });
            return Object.assign({}, config, { behaviors });
        } catch (error) {
            logger.error(error);
            return config;
        }
    }

    return config;
};

type App = {
    app: Express;
    start: () => void;
    stop: () => void;
};

export default async (argConfig: ServerConfig): Promise<App> => {
    const filledConfig = Object.assign({}, defaultConfig, argConfig);
    const config = await loadOpenAPI(filledConfig);

    const app = express();
    app.use(cors());

    enableUI(app);
    enableLogging(app);

    createKeepAliveRoute(app, config.healthCheck);
    createKeepAliveRoute(app, config.readyCheck);

    app.use(behaveHandler({ config }));

    let server;
    return {
        app,
        start: async () => {
            server = app.listen(config.port);
        },
        stop: () => {
            server.close();
        },
    };
};
