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
      count: "unlimited",
    };
  }

  match(request: Request): Expectation[] {
    const matches = this.$expectations
      .filter((exp) => request.method === exp.request.method)
      .filter((exp) => pathMatcher(exp.request, request))
      .filter((exp) => headerMatcher(exp.request, request) === true)
      .filter((exp) => bodyMatcher(exp.request, request) === true)
      .filter((exp) => {
        if (exp.count === "unlimited" || exp.count === undefined) {
          return true;
        }

        const pastMatches = this.$records.filter((rec) => {
          const exps = rec.matches.map((e) => e.id);
          return exps.includes(exp.id);
        }).length;

        return pastMatches < exp.count;
      });

    this.$records.push({
      request,
      matches,
    });

    return matches;
  }

  get records() {
    return this.$records;
  }

  verify(verification: Verification): boolean | VerificationError {
    const { request, count = {} } = verification;

    const least = count.atLeast ?? 1;
    const most = count.atMost ?? "unlimited";

    const matches = this.$records
      .filter((rec) => rec.request.method === request.method)
      .filter((rec) => rec.request.path === request.path)
      .filter((rec) => headerMatcher(rec.request, request) === true)
      .filter((rec) => bodyMatcher(rec.request, request) === true)
      .filter((rec) => rec.matches.length > 0);

    if (matches.length < least) {
      return {
        actual: matches.length,
        expected: least,
        message: `Expected to have received ${request.method}:${request.path} at least ${least} times but was received ${matches.length}`,
        records: matches,
      };
    }

    if (most !== "unlimited" && matches.length > most) {
      return {
        actual: matches.length,
        expected: most,
        message: `Expected to have received ${request.method}:${request.path} at most ${most} times but was received ${matches.length}`,
        records: matches,
      };
    }

    return true;
  }
}

const minimumExpectation: Expectation = {
  name: "sample",
  request: {
    path: "",
  },
  response: {},
};

const validateExpectation = (exp: Expectation): boolean => {
  assert.containsAllDeepKeys(exp, minimumExpectation);
  assert.containsAllDeepKeys(exp.request, minimumExpectation.request);
  return true;
};

export const create = ({ expectations }: Props) => {
  expectations.forEach(validateExpectation);
  return new Engine(expectations);
};
