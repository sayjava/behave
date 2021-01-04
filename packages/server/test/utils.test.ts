import { parseBehaviors } from '../src/utils';

test('fail to parse non array', () => {
    function doParse() {
        return parseBehaviors(
            JSON.stringify({
                request: {
                    method: 'POST',
                },
            }),
        );
    }
    expect(doParse).toThrowErrorMatchingInlineSnapshot(`"Behaviors must be an array"`);
});

test('fail to parse properly formed behavior', () => {
    function doParse() {
        return parseBehaviors(
            JSON.stringify([
                {
                    request: {
                        method: 'POST',
                    },
                },
            ]),
        );
    }
    expect(doParse).toThrowErrorMatchingInlineSnapshot(
        `"Request requires a path: expected { method: 'POST' } to contain key 'path'"`,
    );
});

test('prase properly formed behavior', () => {
    function doParse() {
        return parseBehaviors(
            JSON.stringify([
                {
                    request: {
                        method: 'POST',
                        path: '/hello',
                    },
                },
            ]),
        );
    }
    expect(doParse).not.toThrowError();
});
