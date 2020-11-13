import { Expectation, Request } from "../types";
import { expect } from "chai";

export default (exp: Expectation, req: Request): boolean => {
  let defaultPathRegex = new RegExp(exp.request.path);

  const pathRegexes = Object.entries(exp.request.pathParams || {})
    .map(([key, values]) => {
      const paramsRegex = new RegExp(`{${key}}`);
      return values.map((value) => {
        const newValue = String(exp.request.path).replace(paramsRegex, value);
        return new RegExp(newValue);
      });
    })
    .flat()
    .concat([defaultPathRegex]);

  const [matched] = pathRegexes.filter((regex) => {
    try {
      expect(req.path).match(regex);
      return true;
    } catch (error) {
      return false;
    }
  });

  return !!matched;
};
