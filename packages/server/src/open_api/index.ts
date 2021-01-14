import SwaggerParser from '@apidevtools/swagger-parser';
import { Behavior } from '@sayjava/behave-engine';
import { dirname } from 'path';
import createBody from './create_body';
import createParams from './create_params';
import createResponse from './create_response';

interface Args {
    uri: string;
    basePath?: string;
}

export default async ({ uri, basePath }: Args): Promise<Behavior[]> => {
    const responseBase = basePath ?? dirname(uri);
    const parser = new SwaggerParser();

    const { paths } = await parser.dereference(uri, {
        validate: {
            spec: false,
            schema: true,
        },
    });

    // Generate behaviors for each path
    return Object.entries(paths)
        .map(([requestPath, config]: [string, any]) => {
            return Object.entries(config)

                .filter(([method]) => ['get', 'post', 'delete', 'patch', 'put'].includes(method.toLocaleLowerCase()))

                .map(([method, requestConfig]) => {
                    const {
                        responses,
                        requestBody = { content: {} },
                        parameters = [],
                        operationId,
                        description,
                    } = requestConfig as any;

                    return Object.entries(responses)
                        .map(([status]) => {
                            const body = createBody(requestBody, parameters);
                            const response = createResponse({
                                basePath: responseBase,
                                method,
                                path: requestPath,
                                status,
                            });

                            const { headers, pathParams, queryParams, queryString } = createParams(parameters);

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
