import { Expectation, Request } from "../types";

export default (exp: Expectation, req: Request): boolean => {
  // create the path parameters
  let regexPaths = Object.entries(exp.request.pathParams || {})
    .map(([key, values]) => {
      const paramsRegex = new RegExp(`{${key}}`);
      return values.map((value) => {
        const newValue = String(exp.request.path).replace(paramsRegex, value);
        return new RegExp(newValue);
      });
    })
    .flat()
    .concat([new RegExp(exp.request.path)]);

  if (Object.keys(exp.request.queryParams || {}).length) {
    const queryParams = Object.entries(exp.request.queryParams)
      .map(([key, values]) => {
        return `${key}=(${values.join("|")})`;
      })
      .join(`&`);

    regexPaths = regexPaths.map(
      (path) => new RegExp(`${path.source}\\?${queryParams}`)
    );
  }

  const [matched] = regexPaths.filter((regex) => {
    const [matched] = req.path.match(regex) || [];
    return matched;
  });

  return !!matched;
};
