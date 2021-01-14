import { Behavior, validateBehavior } from '@sayjava/behave-engine';
import formidable from 'formidable';
import { existsSync, readFileSync } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';

export interface BehaveConfig {
    fromFile?: string;
    behaviors?: Array<Behavior>;
    debug?: boolean;
}

export function parseBehaviors(behaviors: string): Array<Behavior> {
    const strBehaviors: Array<any> = JSON.parse(behaviors);

    if (!Array.isArray(strBehaviors)) {
        throw new Error('Behaviors must be an array');
    }
    const validatedBehaviors = strBehaviors.map(validateBehavior);
    return validatedBehaviors;
}

export function loadBehaviors(args: BehaveConfig): Array<any> {
    const { behaviors, fromFile = 'behaviors.json' } = args;

    const filePath = path.join(path.resolve(process.cwd(), fromFile));
    const fileExists = existsSync(filePath);

    if (!behaviors && !fileExists) {
        console.warn('No behaviors was loaded');
        console.warn('see the docs at https://behave.dev');
        return [];
    }

    if (behaviors) {
        return parseBehaviors(JSON.stringify(behaviors));
    }

    if (fileExists) {
        return parseBehaviors(readFileSync(filePath).toString());
    }
}

export function parseBody(
    req: IncomingMessage,
    multiples = false,
): Promise<{
    fields: any;
    files: Array<any>;
}> {
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
}

interface JSONProps {
    status: number;
    res: ServerResponse;
    body: any;
}

export function sendJson({ status, res, body }: JSONProps) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(body));
    return res.end();
}
