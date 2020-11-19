import { AssertionError } from "assert";
import { assert } from "chai";
import { Request } from "../types";

export default (
  expRequest: Request,
  req: Request
): boolean | AssertionError => {
  if (!expRequest.body) {
    return true;
  }

  try {
    assert.match(
      JSON.stringify(req.body),
      new RegExp(JSON.stringify(expRequest.body))
    );

    return true;
  } catch (e) {
    return e;
  }
};
