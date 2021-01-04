import { assert } from 'chai';
import shortId from 'shortid';
import bodyMatcher from './matchers/body';
import headerMatcher from './matchers/headers';
import pathMatcher from './matchers/path';
import { Behavior, IntervalVerification, Record, Request, Verification, VerificationError } from './types';

interface EngineConfig {
    defaultLimit?: number;
}

interface Props {
    behaviors: Behavior[];
    config: EngineConfig;
}

const minimumBehavior: Behavior = {
    name: 'sample',
    request: {
        path: '',
    },
    response: {},
};

export const validateBehavior = (behave: Behavior): Behavior => {
    const newBehavior = Object.assign(
        {
            name: 'Behavior',
            request: {},
            response: { statusCode: 200 },
        },
        behave,
    );
    assert.containsAllDeepKeys(newBehavior, minimumBehavior);
    assert.containsAllDeepKeys(newBehavior.request, minimumBehavior.request, 'Request requires a path');
    return newBehavior;
};

export class Engine {
    private $behaviors: Behavior[];
    private $records: Record[] = [];
    constructor(behaviors: Behavior[]) {
        this.$behaviors = behaviors.map((behave) => {
            return Object.assign(this.baseBehavior(), behave);
        });
    }

    private baseBehavior() {
        return {
            id: shortId(),
            name: 'Behavior',
            limit: 'unlimited',
            response: { statusCode: 200 },
        };
    }

    private verifyRequest(request: Request): Record[] {
        return this.$records
            .filter((rec) => {
                const method = rec.request.method || 'GET';
                return method === request.method;
            })
            .filter((rec) => rec.request.path === request.path)
            .filter((rec) => headerMatcher(request, rec.request) === true)
            .filter((rec) => bodyMatcher(request, rec.request) === true)
            .filter((rec) => rec.matches.length > 0)
            .sort((a, b) => a.timestamp - b.timestamp);
    }

    match(request: Request): Behavior[] {
        const matches = this.$behaviors
            .filter((rec) => {
                const method = rec.request.method || 'GET';
                return method === request.method;
            })
            .filter((exp) => pathMatcher(exp.request, request))
            .filter((exp) => headerMatcher(exp.request, request) === true)
            .filter((exp) => bodyMatcher(exp.request, request) === true)
            .filter((exp) => {
                if (exp.limit === 'unlimited' || exp.limit === undefined) {
                    return true;
                }

                const pastMatches = this.$records.filter((rec) => {
                    const exps = rec.matches.map((e) => e.id);
                    return exps.includes(exp.id);
                }).length;

                return pastMatches < exp.limit;
            });

        this.$records.push({
            request,
            matches,
            timestamp: Date.now(),
        });

        return matches;
    }

    assert(verification: Verification): boolean | VerificationError {
        const { request, limit = {} } = verification;
        const matches = this.verifyRequest(request);

        // set the lower and upper limits
        const verifyLimit = Object.assign({ atMost: 'unlimited', atLeast: limit.atMost ? 0 : 1 }, limit);

        // lower limit check with an unlimited upper limit
        if (verifyLimit.atMost === 'unlimited' && matches.length >= verifyLimit.atLeast) {
            return true;
        }

        // upper limit check
        if (verifyLimit.atMost !== 'unlimited' && matches.length > verifyLimit.atMost) {
            return {
                actual: matches.length,
                expected: verifyLimit.atLeast,
                message: `Expected to have received ${request.method || 'GET'}:${request.path} at most ${
                    verifyLimit.atMost
                } times but was received ${matches.length} times`,
                records: matches,
            };
        }

        // lower limit check
        if (matches.length < verifyLimit.atLeast) {
            return {
                actual: matches.length,
                expected: verifyLimit.atLeast,
                message: `Expected to have received ${request.method || 'GET'}:${request.path} at least ${
                    verifyLimit.atLeast
                } times but was received ${matches.length} times`,
                records: matches,
            };
        }

        return true;
    }

    assertSequence(requests: Request[]): boolean | VerificationError {
        if (requests.length < 2) {
            return {
                actual: `Received ${requests.length} requests`,
                expected: `At least 2 requests`,
                message: `At least 2 requests is needed for verifying a sequence`,
                records: [],
            };
        }

        const allRecords = requests.map((req) => this.verifyRequest(req));
        const firstRecords = allRecords.map((records) => records[0]);

        const allInSequence = firstRecords.reduce((current, record, index) => {
            if (index === 0) {
                return true;
            }
            const prevRecord = firstRecords[index - 1];

            return current && record && prevRecord && prevRecord.timestamp <= record.timestamp;
        }, true);

        if (!allInSequence) {
            const records = allRecords.flat().sort((a, b) => a.timestamp - b.timestamp);

            const actual = records.map((rec) => `${rec.request.method || 'GET'}:${rec.request.path}`);
            const expected = requests.map((r) => `${r.method || 'GET'}:${r.path}`);

            return {
                expected,
                actual,
                message: `Requests matched are not matched`,
                records: allRecords.flat().sort((a, b) => a.timestamp - b.timestamp),
            };
        }

        return true;
    }

    assertInterval(verify: IntervalVerification): boolean | VerificationError {
        const {
            interval: { atLeast, atMost },
        } = verify;

        const requestRecords = verify.requests.map((req) => {
            return { path: req.path, records: this.verifyRequest(req) };
        });
        const records = requestRecords.map((r) => r.records).flat();

        // check for requests with no records
        const [missing] = requestRecords.filter((recs) => recs.records.length === 0);
        if (missing) {
            return {
                actual: `${missing.path} has no records`,
                expected: `All asserted requests must have matched records`,
                message: 'All request must have at least on record',
                records,
            };
        }

        if (records.flat().length < 2) {
            return {
                actual: `Total record for request is ${records.length}`,
                expected: 'At least two request records are required for interval assertions',
                message: 'Request must have at least one record',
                records,
            };
        }

        if (atLeast) {
            const matched = records.reduce((acc, curr, index) => {
                if (index === 0) {
                    return true;
                }
                const prev = records[index - 1];
                return acc && curr.timestamp - prev.timestamp >= atLeast;
            }, true);

            if (!matched) {
                return {
                    actual: `Request was not called apart in ${atLeast} seconds`,
                    expected: `Requests are called ${atLeast} seconds apart`,
                    message: '',
                    records,
                };
            }

            return matched;
        }

        if (atMost) {
            const matched = records.reduce((acc, curr, index) => {
                if (index === 0) {
                    return true;
                }
                const prev = records[index - 1];
                return acc && curr.timestamp - prev.timestamp <= atMost;
            }, true);

            if (!matched) {
                return {
                    actual: `Request was not called apart in ${atMost} seconds`,
                    expected: `Requests are called ${atMost} seconds apart`,
                    message: '',
                    records,
                };
            }

            return matched;
        }

        return true;
    }

    addBehavior(behavior: Behavior) {
        const newBehavior = Object.assign(this.baseBehavior(), behavior);
        const validated = validateBehavior(newBehavior);
        this.$behaviors.push(validated);
    }

    removeBehavior(id: string) {
        this.$behaviors = this.$behaviors.filter((exp) => exp.id !== id);
    }

    clearAllBehavior() {
        this.$behaviors = [];
    }

    clearAllRecords() {
        this.$records = [];
    }

    clearAll() {
        this.clearAllBehavior();
        this.clearAllRecords();
    }

    get records(): Record[] {
        return this.$records;
    }

    get behaviors(): Behavior[] {
        return this.$behaviors;
    }
}

export const create = ({ behaviors }: Props) => {
    const validateBehaviors = behaviors.map(validateBehavior);
    return new Engine(validateBehaviors);
};
