/**
 * Generate request params
 */

import query from 'querystring';

export default (params: { [key: string]: any }) => {
    const pathParams = {};
    const queryParams = {};
    const queryString = {};
    const headers = { };

    params.forEach((param) => {
        if (!param.required) {
            return;
        }

        const property = param.schema || param;

        let value = '.*';
        if (property.enum) {
            value = property.enum.join('|');
        } else if (property.type === 'integer') {
            value = '[0-9]+';
        } else if (property.type === 'string') {
            value = '[a-zA-Z]+';
        } else if (property.type === 'boolean') {
            value = 'true|false';
        }

        switch (param.in) {
            case 'query':
                if (param.required) {
                    return (queryString[param.name] = value);
                } else {
                    return (queryParams[param.name] = value);
                }

            case 'header':
                return (headers[param.name] = value);

            case 'body':
                return;

            default:
                return (pathParams[param.name] = value);
        }
    });

    return { pathParams, queryParams, headers, queryString: query.stringify(queryString) };
};
