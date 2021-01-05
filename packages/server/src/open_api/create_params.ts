/**
 * Generate request params
 */

import query from 'querystring';

export default (contentType: string, params: { [key: string]: any }) => {
    const pathParams = {};
    const queryParams = {};
    const queryString = {};
    const headers = { 'content-type': contentType };

    params.forEach((param) => {

      if(!param.required) {
        return 
      }

        let value = '.*';
        if (param.schema.enum) {
            value = param.schema.enum.join('|')
        } else if (param.schema.type === 'integer') {
            value = '[0-9]+';
        } else if (param.schema.type === 'string') {
            value = '[a-zA-Z]+';
        } else if (param.schema.type === 'boolean') {
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

            default:
                return (pathParams[param.name] = value);
        }
    });

    return { pathParams, queryParams, headers, queryString: query.stringify(queryString) };
};
