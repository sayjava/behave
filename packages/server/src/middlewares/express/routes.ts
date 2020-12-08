import { Engine, Request as EngineRequest } from "@sayjava/behave-engine";
import { Request, Response } from "express";
import { readFileSync } from "fs";

export default (engine: Engine) => (req: Request, res: Response) => {
  const engineRequest: EngineRequest = {
    path: req.url,
    method: req.method as any,
    headers: req.headers as any,
    body: req.body,
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
      if (file) {
        try {
          const fileContent = readFileSync(file).toString();
          return res.status(statusCode).send(fileContent);
        } catch (error) {
          return res.status(500).send({
            error,
          });
        }
      }

      if (attachment) {
        return res.status(statusCode).attachment(attachment);
      }

      return res.status(statusCode).send(body);
    }, delay);
  } else {
    res.status(404).json({
      path: req.path,
    });
  }
};
