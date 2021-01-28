import { AssertionError } from 'assert';
import { assert } from 'chai';
import { Request } from '../types';

export default (expRequest: Request, req: Request): boolean | AssertionError => {
    const methodRegex = new RegExp((expRequest.method || 'GET').toLocaleLowerCase());

    try {
        assert.match(req.method.toLocaleLowerCase(), methodRegex);
        return true;
    } catch (e) {
        return e;
    }
};
