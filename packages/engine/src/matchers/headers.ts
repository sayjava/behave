import { AssertionError } from "assert";
import { assert } from "chai";
import { Request } from "../types";

export default (
  expRequest: Request,
  req: Request
): boolean | AssertionError => {
  if (Object.keys(expRequest.headers || {}).length === 0) {
    return true;
  }

  try {
    // check matching keys
    assert.containsAllKeys(req.headers, expRequest.headers || {});

    // check matching values
    Object.entries(expRequest.headers || {}).forEach(([key, expValue]) => {
      assert.match((req.headers || {})[key], new RegExp(expValue));
    });

    return true;
  } catch (e) {
    return e;
  }
};
