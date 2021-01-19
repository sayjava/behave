import { Behavior, Engine } from '@sayjava/behave-engine';
import { IncomingMessage, ServerResponse } from 'http';
import prettyoutput from 'prettyoutput';
import createAssertHandler from '../handlers/assert';
import createBehaviorsHandler from '../handlers/behaviors';
import createRecordsHandler from '../handlers/records';
import createRoutesHandler from '../handlers/routes';
import createSequenceHandler from '../handlers/sequence';
import logger from "../logger";
import { BehaveConfig, loadBehaviors, sendJson } from '../utils';

export interface BehaveNodeHttpProps {
    config: BehaveConfig;
}

const log = (behaviors: Behavior[]) => {
    logger.info(`|- - - - - - Loaded Behaviors (${behaviors.length}) - - - - - -|\n\n`);
    behaviors.forEach((be) => logger.info(prettyoutput(be)));
    logger.info(`|- - - - - - Loaded Behaviors - - - - - -|`);
};

export default ({ config }: BehaveNodeHttpProps) => {
    const behaviors = loadBehaviors(config);
    const engine = new Engine(behaviors);

    const recordsHandler = createRecordsHandler(engine);
    const behaviorsHandler = createBehaviorsHandler(engine);
    const routesHandler = createRoutesHandler(engine);
    const assertHandler = createAssertHandler(engine);
    const sequenceHandler = createSequenceHandler(engine);

    log(behaviors);

    return (req: IncomingMessage, res: ServerResponse) => {
        switch (req.url) {
            case '/_/api/behaviors':
                return behaviorsHandler(req, res);

            case '/_/api/records':
                return recordsHandler(req, res);

            case '/_/api/requests/assert':
                return assertHandler(req, res);

            case '/_/api/requests/sequence':
                return sequenceHandler(req, res);

            case '/_/api/reset': {
                engine.clearAll();
                return sendJson({ res, status: 201, body: { ok: true } });
            }

            default:
                return routesHandler(req, res);
        }
    };
};
