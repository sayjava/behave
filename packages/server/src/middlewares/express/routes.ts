import { Engine } from "flyt-engine";
import { Request, Response } from "express";

export default (engine: Engine) => (req: Request, res: Response) => {
  const engineRequest = {
    path: req.path,
    method: req.method,
    body: req.body,
    headers: req.headers,
  };

  const [matched] = engine.match(engineRequest);

  if (matched) {
    const { statusCode, body = "", headers = {}, delay = 0 } = matched.response;

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value as any);
    });

    setTimeout(() => res.status(statusCode || 200).send(body), delay);
  } else {
    res.status(404).json({
      path: req.path,
    });
  }
};
