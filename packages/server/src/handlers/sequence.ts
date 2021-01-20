import { Engine } from '@sayjava/behave-engine';
import { IncomingMessage, ServerResponse } from 'http';
import { parseBody, sendJson } from '../utils';
import logger from "../logger"

export default (engine: Engine) => async (req: IncomingMessage, res: ServerResponse) => {
    switch (req.method) {
        case 'PUT':
            try {
                const { fields } = await parseBody(req);
                const { requests = [] } = fields;

                const result = engine.assertSequence(requests);
                if (result === true) {
                    return sendJson({ res, status: 202, body: {} });
                }

                return sendJson({ res, status: 406, body: result });
            } catch (error) {
                logger.error(error);
                return sendJson({ res, status: 400, body: error });
            }

        default: {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Only PUT method is supported' }));
            return res.end();
        }
    }
};
