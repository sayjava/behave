import cors from 'cors';
import express, { Express } from 'express';
import behaveHandler from './handlers/';
import logger from './logger';
import openAPI from './open_api';

export interface ServerConfig {
    port?: number;
    fromFile?: string;
    openApi?: string;
    behaviors?: Array<any>;
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
    app.use((req, res, next) => {
        if(!req.path.includes("/_/")) {
            const log = {
                method: req.method,
                path: req.path,
                query: req.query,
                body: req.body
            }
            logger.info(log);
        }
        next()
    });
};

const enableUI = (app: Express) => {
    app.use('/_ui/', express.static('public'));
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

export default async (argConfig: ServerConfig) => {
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
