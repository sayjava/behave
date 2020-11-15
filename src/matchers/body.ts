import { Expectation, Request } from "../types";
import { assert } from "chai";
import { AssertionError } from "assert";

export default (exp: Expectation, req: Request): boolean | AssertionError => {
  try {
    assert.match(
      JSON.stringify(req.body),
      new RegExp(JSON.stringify(exp.request.body))
    );

    return true;
  } catch (e) {
    return e;
  }
};
