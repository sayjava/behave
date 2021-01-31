import { Behavior, Engine, Request as EngineRequest } from '@sayjava/behave-engine';
import { existsSync, readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { IncomingMessage, ServerResponse } from 'http';
import logger from '../logger';
import { createTemplateParams, parseBody, sendJson } from '../utils';

const logMatched = (matched: Behavior) => {
    const log = {
        id: matched.id,
        name: matched.name,
        path: matched.request.path,
        method: matched.request.method,
        status: matched.response.statusCode || 200,
        info: 'Behavior Matched',
    };
    logger.info(log);
};

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
            const templateParams = createTemplateParams({
                req,
                body: engineRequest.body,
                path: matched.request.path,
            });

            logMatched(matched);

            const { statusCode = 200, body = '', headers = {}, delay = 0, file } = matched.response;
            Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value as any));

            setTimeout(() => {
                if (file) {
                    if (existsSync(file)) {
                        res.writeHead(statusCode, {});
                        const fileContent = readFileSync(file).toString();
                        const template = Handlebars.compile(fileContent);
                        res.write(template(templateParams));
                        return res.end();
                    } else {
                        return sendJson({
                            res,
                            status: 400,
                            body: { message: `${file} can not be found on the server` },
                        });
                    }
                }

                const template = Handlebars.compile(JSON.stringify(body));
                res.writeHead(statusCode, {});
                res.write(template(templateParams));
                return res.end();
            }, delay);
        } else {
            const log = { path: req.url, method: req.method, info: 'Behavior Not Matched' };
            logger.warn(log);
            return sendJson({ res, status: 404, body: { path: req.url, method: req.method } });
        }
    } catch (error) {
        console.error(error);
        logger.error(error);
        return sendJson({ res, status: 404, body: { error } });
    }
};
