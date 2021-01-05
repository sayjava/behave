/**
 * Create a request body from the open api spec
 *
 * Only the first response will be considered
 */

type AnyMap = { [key: string]: any };

export default (requestBody: AnyMap) => {
    const { content } = requestBody;
    const [contentKey] = Object.keys(content);

    if (!contentKey) {
        return {};
    }

    const body = {};
    const { schema } = content[contentKey];

    if (schema.properties) {
        Object.entries(schema.properties).forEach(([name, property]: [string, any]) => {
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
