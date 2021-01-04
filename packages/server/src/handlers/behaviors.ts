import { Behavior, Engine } from '@sayjava/behave-engine';
import { IncomingMessage, ServerResponse } from 'http';
import { parseBody, sendJson } from '../utils';

export default (engine: Engine) => async (req: IncomingMessage, res: ServerResponse) => {
    switch (req.method) {
        case 'GET': {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(engine.behaviors));
            return res.end();
        }

        case 'POST':
            try {
                const { fields } = await parseBody(req);
                const behaviors: Array<Behavior> = Object.values(fields);

                behaviors.forEach((be) => engine.addBehavior(be));
                return sendJson({ res, status: 201, body: { message: 'ok' } });
            } catch (error) {
                return sendJson({
                    res,
                    status: 400,
                    body: {
                        message: error.message,
                        actual: error.actual,
                        expected: error.expected,
                    },
                });
            }

        default:
            return sendJson({
                status: 401,
                res,
                body: { message: 'Only POST method is supported' },
            });
    }
};
