import { Expectation, Request } from "../types";

export default (expRequest: Request, req: Request): boolean => {
  // create the path parameters
  let regexPaths = Object.entries(expRequest.pathParams || {})
    .map(([key, values]) => {
      const paramsRegex = new RegExp(`{${key}}`);
      return values.map((value) => {
        const newValue = String(expRequest.path).replace(paramsRegex, value);
        return new RegExp(newValue);
      });
    })
    .flat()
    .concat([new RegExp(expRequest.path)]);

  // include the query parameters in the generated paths
  if (Object.keys(expRequest.queryParams || {}).length) {
    const queryParams = Object.entries(expRequest.queryParams)
      .map(([key, values]) => `${key}=(${values.join("|")})`)
      .join(`&`);

    regexPaths = regexPaths.map(
      (path) => new RegExp(`${path.source}\\?${queryParams}`)
    );
  }

  // at least one of the generated paths should match
  const [matched] = regexPaths.filter((regex) => req.path.match(regex)).flat();
  return !!matched;
};
