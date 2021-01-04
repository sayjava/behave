import { Engine } from '@sayjava/behave-engine';
import { IncomingMessage, ServerResponse } from 'http';
import createAssertHandler from '../handlers/assert';
import createBehaviorsHandler from '../handlers/behaviors';
import createRecordsHandler from '../handlers/records';
import createRoutesHandler from '../handlers/routes';
import createSequenceHandler from '../handlers/sequence';
import { BehaveConfig, loadBehaviors, sendJson } from '../utils';

export interface BehaveNodeHttpProps {
    config: BehaveConfig;
}

export default ({ config }: BehaveNodeHttpProps) => {
    const behaviors = loadBehaviors(config);
    const engine = new Engine(behaviors);

    const recordsHandler = createRecordsHandler(engine);
    const behaviorsHandler = createBehaviorsHandler(engine);
    const routesHandler = createRoutesHandler(engine);
    const assertHandler = createAssertHandler(engine);
    const sequenceHandler = createSequenceHandler(engine);

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
