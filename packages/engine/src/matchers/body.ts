import { AssertionError } from "assert";
import { assert } from "chai";
import { Request } from "../types";
import mapMatcher from "./map";

export default (
  expRequest: Request,
  req: Request
): boolean | AssertionError => {
  if (!expRequest.body) {
    return true;
  }

  const contentType = req.headers["Content-Type"] || "";
  if (contentType.includes("json")) {
    return mapMatcher(
      expRequest.body as { [key: string]: any },
      req.body as { [key: string]: any }
    );
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
