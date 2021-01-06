/**
 * Create a request body from the open api spec
 *
 * Only the first response will be considered
 */

type AnyMap = { [key: string]: any };

const extractSwaggerBody = (params: any[]) => {
    const [body] = params.filter((param) => param.in === 'body');
    return body || { schema: {} };
};

const extractSpecBody = (requestBody) => {
    const { content } = requestBody;
    const [contentKey = ""] = Object.keys(content);

    return content[contentKey] || { schema: {} };
};

export default (requestBody: AnyMap, parameters: any[]) => {
    const body = {};
    const specBody = extractSpecBody(requestBody);
    const swaggerBody = extractSwaggerBody(parameters);

    const properties = specBody.schema.properties || swaggerBody.schema.properties;

    if (properties) {
        Object.entries(properties).forEach(([name, property]: [string, any]) => {
            let value = '.*';
            if (property.enum) {
                value = property.enum.join('|');
            } else if (property.type === 'integer') {
                value = property.pattern || '[0-9]+';
            } else if (property.type === 'string') {
                value = property.pattern || '[a-zA-Z]+';
            } else if (property.type === 'boolean') {
                value = property.pattern || 'true|false';
            }

            body[name] = value;
        });
    }

    return body;
};
