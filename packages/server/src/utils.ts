import { Behavior, validateBehavior } from '@sayjava/behave-engine';
import cookie from 'cookie';
import formidable from 'formidable';
import { existsSync, readFileSync } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { match } from 'path-to-regexp';
import qs from 'qs';
import Yaml from 'yaml';
import logger from './logger';
export interface BehaveConfig {
    fromFile?: string;
    behaviors?: Array<Behavior>;
    debug?: boolean;
}

export const parseBehaviors = (behaviors: string): Array<Behavior> => {
    const strBehaviors: Array<any> = JSON.parse(behaviors);

    if (!Array.isArray(strBehaviors)) {
        throw new Error('Behaviors must be an array');
    }
    const validatedBehaviors = strBehaviors.map(validateBehavior);
    return validatedBehaviors;
};

export const loadBehaviors = (args: BehaveConfig): Array<any> => {
    const { behaviors, fromFile = 'behaviors.json' } = args;

    const filePath = path.join(path.resolve(process.cwd(), fromFile));
    const fileExists = existsSync(filePath);

    if (!behaviors && !fileExists) {
        logger.warn('No behaviors was loaded');
        logger.warn('see the docs at https://behave.dev');
        return [];
    }

    if (behaviors) {
        return parseBehaviors(JSON.stringify(behaviors));
    }

    if (fileExists) {
        const fileContent = readFileSync(filePath, 'utf-8');
        if (['.yaml', '.yml'].includes(path.extname(filePath))) {
            return parseBehaviors(JSON.stringify(Yaml.parse(fileContent)));
        }
        return parseBehaviors(fileContent);
    }
};

export const parseBody = (
    req: IncomingMessage,
    multiples = false,
): Promise<{
    fields: any;
    files: Array<any>;
}> => {
    const form = formidable({
        multiples,
        enabledPlugins: ['octetstream', 'querystring', 'json'],
    });

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }

            return resolve({ fields, files });
        });
    });
};

interface JSONProps {
    status: number;
    res: ServerResponse;
    body: any;
}

export const sendJson = ({ status, res, body }: JSONProps) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(body));
    return res.end();
};

export const createTemplateParams = (props: { req: IncomingMessage; body: any; path: string }) => {
    const { req, body, path } = props;
    const [requestPath, urlParams] = decodeURIComponent(req.url).split('?');
    const [configuredPath] = path.split('?');
    const queryParams = qs.parse(urlParams || '');

    const pathParams = {};
    try {
        const pathRegexp = match(configuredPath);
        const { params } = pathRegexp(requestPath) as any;
        Object.assign(pathParams, params);
    } catch (error) {
        logger.warn(error);
    }

    return {
        req: {
            headers: req.rawHeaders,
            method: req.method,
            path: requestPath,
            cookies: cookie.parse(req.headers.cookie || ''),
            body,
            queryParams,
            pathParams,
        },
    };
};
