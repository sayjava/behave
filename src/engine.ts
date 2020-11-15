import { Expectation, Request } from "./types";
import { assert } from "chai";
import headerMatcher from "./matchers/headers";
import pathMatcher from "./matchers/path";
import bodyMatcher from "./matchers/body";

interface EngineConfig {}

interface Props {
  expectations: Expectation[];
  config: EngineConfig;
}

class Engine {
  private $matches: Expectation[] = [];
  private $requests: Request[] = [];

  constructor(private expectations: Expectation[]) {}

  match(req: Request): Expectation[] {
    this.$requests.push(req);

    return this.expectations
      .filter((exp) => req.method === exp.request.method)
      .filter((exp) => pathMatcher(exp, req))
      .filter((exp) => headerMatcher(exp, req) === true)
      .filter((exp) => bodyMatcher(exp, req) === true);
  }

  get matches() {
    return this.$matches;
  }

  get requests() {
    return this.$requests;
  }
}

const minimumExpectation: Expectation = {
  name: "sample",
  request: {
    headers: {},
    method: "GET",
    path: "",
  },
  response: {
    body: "",
  },
};

const validateExpectation = (exp: Expectation): boolean => {
  assert.containsAllDeepKeys(exp, minimumExpectation);
  assert.containsAllDeepKeys(exp.request, minimumExpectation.request);
  assert.containsAllDeepKeys(exp.response, minimumExpectation.response);
  return true;
};

export const create = ({ expectations }: Props) => {
  expectations.forEach(validateExpectation);
  return new Engine(expectations);
};
