import { AssertionError } from 'assert';
import { assert } from 'chai';

export default (expected: { [key: string]: any }, actual: { [key: string]: any }): boolean | AssertionError => {
    if (Object.keys(expected).length === 0) {
        return true;
    }

    try {
        // check matching keys
        if (Array.isArray(actual)) {
            assert.match(
                JSON.stringify(actual),
                new RegExp(JSON.stringify(expected)),
                `key: ${JSON.stringify(actual)}, does not match, ${JSON.stringify(expected)}`,
            );
        } else {
            assert.containsAllKeys(actual, expected);
            // check matching values
            Object.entries(expected).forEach(([key, expValue]) => {
                assert.match(
                    JSON.stringify(actual[key]),
                    new RegExp(expValue),
                    `key: ${key}, does not match, ${expValue} did not match ${actual[key]}`,
                );
            });
        }

        return true;
    } catch (e) {
        return e;
    }
};
