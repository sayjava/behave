import SwaggerParser from '@apidevtools/swagger-parser';
import { Behavior } from '@sayjava/behave-engine';
import { existsSync } from 'fs';
import { dirname } from 'path';
import createBody from './create_body';
import createParams from './create_params';
import createResponse from './create_response';

interface Args {
    uri: string;
    basePath?: string;
}

export default async ({ uri, basePath }: Args): Promise<Behavior[]> => {
    if (!existsSync(uri)) {
        throw new Error(`${uri} can not be found`);
    }

    const responseBase = basePath ?? dirname(uri);
    const parser = new SwaggerParser();

    const { paths, components } = await parser.dereference(uri);

    // Generate behaviors for each path
    return Object.entries(paths)
        .map(([requestPath, config]: [string, any]) => {
            return Object.entries(config)
                .map(([method, requestConfig]) => {
                    const {
                        responses,
                        requestBody = { content: {} },
                        parameters = [],
                        operationId,
                        description,
                    } = requestConfig as any;

                    return Object.entries(responses)
                        .map(([status, responseContent]) => {
                            const [[contentType]] = Object.entries(
                                (responseContent as any).content || {
                                    'text/plain': 'text/plain',
                                },
                            );

                            const body = createBody(requestBody);
                            const response = createResponse({
                                basePath: responseBase,
                                method,
                                path: requestPath,
                                status,
                            });

                            const { headers, pathParams, queryParams, queryString } = createParams(
                                contentType,
                                parameters,
                            );

                            let fullPath = queryString.length ? `${requestPath}?${queryString}` : requestPath;
                            fullPath = fullPath.replace(/}/g, '');
                            fullPath = fullPath.replace(/{/g, ':');

                            return {
                                name: operationId,
                                description: description,
                                request: {
                                    path: `${fullPath}$`,
                                    method: method.toUpperCase() as any,
                                    headers,
                                    pathParams,
                                    queryParams,
                                    body,
                                },
                                ...response,
                            };
                        })
                        .flat();
                })
                .flat();
        })
        .flat();
};
