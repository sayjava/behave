import { Expectation, Request } from "../types";
import { assert } from "chai";
import { AssertionError } from "assert";

export default (exp: Expectation, req: Request): boolean | AssertionError => {
  if (Object.keys(exp.request.headers).length === 0) {
    return true;
  }

  try {
    // check matching keys
    assert.containsAllKeys(req.headers, exp.request.headers);

    // check matching values
    Object.entries(exp.request.headers).forEach(([key, expValue]) => {
      assert.match(req.headers[key], new RegExp(expValue));
    });

    return true;
  } catch (e) {
    return e;
  }
};
