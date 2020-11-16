import { assert } from "chai";
import shortId from "shortid";
import bodyMatcher from "./matchers/body";
import headerMatcher from "./matchers/headers";
import pathMatcher from "./matchers/path";
import { Expectation, Record, Request } from "./types";

interface EngineConfig {}

interface Props {
  expectations: Expectation[];
  config: EngineConfig;
}

class Engine {
  private $matches: Expectation[] = [];
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
      .filter((exp) => pathMatcher(exp, request))
      .filter((exp) => headerMatcher(exp, request) === true)
      .filter((exp) => bodyMatcher(exp, request) === true)
      .filter((exp) => {
        if (exp.count === "unlimited") {
          return true;
        }

        const pastMatches = this.$records.filter((rec) => {
          const exps = rec.matches.map((e) => e.id);
          return exps.includes(exp.id);
        });

        return pastMatches.length <= Number(exp.count);
      });

    this.$records.push({
      request,
      matches,
    });

    return matches;
  }

  get matches() {
    return this.$matches;
  }

  get records() {
    return this.$records;
  }
}

const minimumExpectation: Expectation = {
  name: "sample",
  request: {
    headers: {},
    method: "GET",
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
