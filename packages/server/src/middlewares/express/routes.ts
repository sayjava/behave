import { Engine } from "flyt-engine";

export default (engine: Engine) => (req, res) => {
  const engineRequest = {
    path: req.path,
    method: req.method,
    body: req.body,
    headers: req.headers,
  };

  const [matched] = engine.match(engineRequest);

  if (matched) {
    const { statusCode, body } = matched.response;
    res.status(statusCode || 200).send(body);
  } else {
    res.status(404).send({
      path: req.path,
    });
  }
};
