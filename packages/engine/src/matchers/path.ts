import { Request } from '../types';

export default (expRequest: Request, req: Request): boolean => {
    let expectedPath = Object.entries(expRequest.pathParams || {}).reduce((acc, curr) => {
        const [key, value] = curr;
        const paramsRegex = new RegExp(`:${key}`);
        return acc.replace(paramsRegex, `${value}`);
    }, expRequest.path);

    const query = Object.entries(expRequest.queryParams || {})
        .map(([key, value]) => `${key}=${decodeURIComponent(value)}`)
        .join(`&`);

    if (query.length) {
        expectedPath = `${expectedPath}\\?${query}`;
    }

    const regexPath = new RegExp(expectedPath);
    return !!regexPath.exec(decodeURIComponent(req.path));
};
