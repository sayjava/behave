import express, { Express } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { Engine, Verification } from "flyt-engine";

interface ServerConfig {
  port?: number;
  keepAlivePath?: string;
  engine: Engine;
  debugLevel?: "none" | "verbose";
}

const defaultConfig: ServerConfig = {
  port: 8080,
  engine: new Engine([]),
  keepAlivePath: "/_alive",
  debugLevel: "none",
};

const createRestRoute = (app: Express, config: ServerConfig) => {
  app.route("/_/api/expectations").get((req, res) => {
    res.status(200).json(config.engine.expectations);
  });

  app.route("/_/api/records").get((req, res) => {
    res.status(200).json(config.engine.records);
  });
};

const createVerificationRoute = (app: Express, config: ServerConfig) => {
  app.route("/_/api/verify").post((req, res) => {
    try {
      const { verifications } = req.body;

      const verified = verifications.map((verify: Verification) =>
        config.engine.verify(verify)
      );
      const pass = verified.filter((res) => typeof res !== "boolean");

      if (pass.length !== 0) {
        return res.status(406).send(pass);
      }

      return res.status(202).send({});
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  });
};

const createKeepAliveRoute = (app: Express, path: string) => {
  app.get(path, (req, res) => {
    res.status(200).send("Ok");
  });
};

const createExpectationRoute = (app: Express, config: ServerConfig) => {
  app.use((req, res) => {
    const engineRequest = {
      path: req.path,
      method: req.method,
      body: req.body,
      headers: req.headers,
    };

    const [matched] = config.engine.match(engineRequest);

    if (matched) {
      const { statusCode, body } = matched.response;
      res.status(statusCode || 200).send(body);
    } else {
      res.status(404).send({
        path: req.path,
      });
    }
  });
};

const enableLogging = (app: Express, config: ServerConfig) => {
  switch (config.debugLevel) {
    case "none":
      break;
    case "verbose":
      app.use(morgan("common"));
      break;
  }
};

export default (argConfig: ServerConfig) => {
  const app = express();
  app.use(bodyParser.json());

  const config = Object.assign({}, defaultConfig, argConfig);

  return {
    start: () => {
      enableLogging(app, config);

      createKeepAliveRoute(app, config.keepAlivePath);
      createRestRoute(app, config);
      createVerificationRoute(app, config);
      createExpectationRoute(app, config);

      app.listen(config.port, () => {
        console.info(`Flyt Sever started on ${config.port}`);
      });
    },
    stop: () => {},
  };
};
