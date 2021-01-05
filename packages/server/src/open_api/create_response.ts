/**
 * Generate a behave response using the filesystem
 * The response path is request_path + method + status
 */

import { Response } from '@sayjava/behave-engine';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default ({ method, status, path, basePath }): { response: Response; limit?: any; delay?: number } => {
    const paths = path.split('/');
    const responsePath =
        path === '/'
            ? join(basePath, `index`, method, `${status}.json`)
            : join(basePath, ...paths, method, `${status}.json`);

    if (!existsSync(responsePath)) {
        return {
            response: {
                statusCode: status,
                body: {
                    message: `${responsePath} does not exists on this server. To  See https://sayjava.github.io/behave/api_spec`,
                },
            },
        };
    }

    try {
        const { headers, content, delay = 0, limit = 'unlimited' } = JSON.parse(readFileSync(responsePath).toString());
        return {
            response: {
                statusCode: status,
                body: content,
                headers,
            },
            delay,
            limit,
        };
    } catch (error) {
        return {
            response: {
                statusCode: 500,
                body: {
                    message: `There is a problem parsing ${responsePath}`,
                    error,
                },
            },
        };
    }
};
