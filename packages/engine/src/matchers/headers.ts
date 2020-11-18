import { AssertionError } from "assert";
import { assert } from "chai";
import { Request } from "../types";

export default (
  expRequest: Request,
  req: Request
): boolean | AssertionError => {
  const reqHeaders = expRequest.headers || {};

  if (Object.keys(reqHeaders).length === 0) {
    return true;
  }

  try {
    // check matching keys
    assert.containsAllKeys(req.headers, reqHeaders);

    // check matching values
    Object.entries(reqHeaders).forEach(([key, expValue]) => {
      assert.match(req.headers[key], new RegExp(expValue));
    });

    return true;
  } catch (e) {
    return e;
  }
};
