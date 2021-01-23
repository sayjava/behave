import { Engine, Request as EngineRequest } from '@sayjava/behave-engine';
import { existsSync, readFileSync } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import logger from '../logger';
import { parseBody, sendJson } from '../utils';

export default (engine: Engine) => async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const { fields: body = {} } = await parseBody(req);

        const engineRequest: EngineRequest = {
            path: req.url,
            method: req.method as any,
            headers: req.headers as any,
            body,
            time: Date.now(),
        };

        const [matched] = engine.match(engineRequest);

        if (matched) {
            const log = {
                id: matched.id,
                name: matched.name,
                path: matched.request.path,
                info: 'Behavior Matched',
            };
            logger.info(log);
            const { statusCode = 200, body = '', headers = {}, delay = 0, file, attachment } = matched.response;

            Object.entries(headers).forEach(([key, value]) => {
                res.setHeader(key, value as any);
            });

            setTimeout(() => {
                if (file) {
                    if (existsSync(file)) {
                        res.writeHead(statusCode, {});
                        const fileContent = readFileSync(file).toString();
                        res.write(fileContent);
                        return res.end();
                    } else {
                        return sendJson({
                            res,
                            status: 400,
                            body: { message: `${file} can not be found on the server` },
                        });
                    }
                }

                res.writeHead(statusCode, {});
                res.write(JSON.stringify(body));
                return res.end();
            }, delay);
        } else {
            const log = { path: req.url, info: 'Behavior Not Matched' };
            logger.warn(log);
            return sendJson({ res, status: 404, body: { path: req.url } });
        }
    } catch (error) {
        logger.error(error);
        return sendJson({ res, status: 404, body: { error } });
    }
};
