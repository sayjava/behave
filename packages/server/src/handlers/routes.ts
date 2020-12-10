import { Engine, Request as EngineRequest } from "@sayjava/behave-engine";
import { readFileSync } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { parseBody, sendJson } from "../utils";

export default (engine: Engine) => async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const { fields: body = {} } = await parseBody(req);

    const engineRequest: EngineRequest = {
      path: req.url,
      method: req.method as any,
      headers: req.headers as any,
      body,
      time: Date.now(),
    };

    const [matched] = engine.match(engineRequest);

    if (matched) {
      const {
        statusCode = 200,
        body = "",
        headers = {},
        delay = 0,
        file,
        attachment,
      } = matched.response;

      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value as any);
      });

      setTimeout(() => {
        if (!res.hasHeader("Content-Type")) {
          res.writeHead(statusCode, { "Content-Type": "application/json" });
        } else {
          res.writeHead(statusCode, {});
        }

        if (file) {
          const fileContent = readFileSync(file).toString();
          res.write(fileContent);
          return res.end();
        }

        res.write(JSON.stringify(body));
        return res.end();
      }, delay);
    } else {
      return sendJson({ res, status: 404, body: { path: req.url } });
    }
  } catch (error) {
    return sendJson({ res, status: 404, body: { error } });
  }
};
