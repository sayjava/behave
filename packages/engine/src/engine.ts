import { assert } from "chai";
import shortId from "shortid";
import bodyMatcher from "./matchers/body";
import headerMatcher from "./matchers/headers";
import pathMatcher from "./matchers/path";
import {
  Expectation,
  Record,
  Request,
  Verification,
  VerificationError,
} from "./types";

interface EngineConfig {}

interface Props {
  expectations: Expectation[];
  config: EngineConfig;
}

const minimumExpectation: Expectation = {
  name: "sample",
  request: {
    path: "",
  },
  response: {},
};

export const validateExpectation = (exp: Expectation): boolean => {
  assert.containsAllDeepKeys(exp, minimumExpectation);
  assert.containsAllDeepKeys(exp.request, minimumExpectation.request);
  return true;
};

export class Engine {
  private $expectations: Expectation[];
  private $records: Record[] = [];

  constructor(expectations: Expectation[]) {
    this.$expectations = expectations.map((exp) => {
      return Object.assign(this.basicExpectation(), exp);
    });
  }

  private basicExpectation() {
    return {
      id: shortId(),
      limit: "unlimited",
    };
  }

  private verifyRequest(request: Request): Record[] {
    return this.$records
      .filter((rec) => rec.request.method === request.method)
      .filter((rec) => rec.request.path === request.path)
      .filter((rec) => headerMatcher(request, rec.request) === true)
      .filter((rec) => bodyMatcher(request, rec.request) === true)
      .filter((rec) => rec.matches.length > 0)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  match(request: Request): Expectation[] {
    const matches = this.$expectations
      .filter((exp) => request.method === exp.request.method)
      .filter((exp) => pathMatcher(exp.request, request))
      .filter((exp) => headerMatcher(exp.request, request) === true)
      .filter((exp) => bodyMatcher(exp.request, request) === true)
      .filter((exp) => {
        if (exp.limit === "unlimited" || exp.limit === undefined) {
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

  verify(verification: Verification): boolean | VerificationError {
    const { request, limit = {} } = verification;
    const matches = this.verifyRequest(request);

    // set the lower and upper limits
    const verifyLimit = Object.assign(
      { atMost: "unlimited", atLeast: limit.atMost ? 0 : 1 },
      limit
    );

    // lower limit check with an unlimited upper limit
    if (
      verifyLimit.atMost === "unlimited" &&
      matches.length >= verifyLimit.atLeast
    ) {
      return true;
    }

    // upper limit check
    if (
      verifyLimit.atMost !== "unlimited" &&
      matches.length > verifyLimit.atMost
    ) {
      return {
        actual: matches.length,
        expected: verifyLimit.atLeast,
        message: `Expected to have received ${request.method || "GET"}:${
          request.path
        } at most ${verifyLimit.atMost} times but was received ${
          matches.length
        } times`,
        records: matches,
      };
    }

    // lower limit check
    if (matches.length < verifyLimit.atLeast) {
      return {
        actual: matches.length,
        expected: verifyLimit.atLeast,
        message: `Expected to have received ${request.method || "GET"}:${
          request.path
        } at least ${verifyLimit.atLeast} times but was received ${
          matches.length
        } times`,
        records: matches,
      };
    }

    return true;
  }

  verifySequence(requests: Request[]): boolean | VerificationError {
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

      return (
        current &&
        record &&
        prevRecord &&
        prevRecord.timestamp <= record.timestamp
      );
    }, true);

    if (!allInSequence) {
      const records = allRecords
        .flat()
        .sort((a, b) => a.timestamp - b.timestamp);

      const actual = records.map(
        (rec) => `${rec.request.method || "GET"}:${rec.request.path}`
      );
      const expected = requests.map((r) => `${r.method || "GET"}:${r.path}`);

      return {
        expected,
        actual,
        message: `Requests matched are not matched`,
        records: allRecords.flat().sort((a, b) => a.timestamp - b.timestamp),
      };
    }

    return true;
  }

  addExpectation(exp: Expectation) {
    validateExpectation(exp);
    const newExp = Object.assign({}, this.basicExpectation(), exp);
    this.$expectations.push(newExp);
  }

  removeExpectation(id: string) {
    this.$expectations = this.$expectations.filter((exp) => exp.id === id);
  }

  get records(): Record[] {
    return this.$records;
  }

  get expectations(): Expectation[] {
    return this.$expectations;
  }
}

export const create = ({ expectations }: Props) => {
  expectations.forEach(validateExpectation);
  return new Engine(expectations);
};
