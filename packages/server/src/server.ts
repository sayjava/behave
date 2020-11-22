import bodyParser from "body-parser";
import express, { Express } from "express";
import { Engine } from "flyt-engine";
import morgan from "morgan";
import flyMiddleware from "./middlewares/express";

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

const createKeepAliveRoute = (app: Express, path: string) => {
  app.get(path, (req, res) => {
    res.status(200).send("Ok");
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
  const config = Object.assign({}, defaultConfig, argConfig);

  const app = express();
  app.use(bodyParser.json());

  enableLogging(app, config);
  createKeepAliveRoute(app, config.keepAlivePath);
  flyMiddleware(app, config.engine);

  return {
    start: () => {
      app.listen(config.port, () => {
        console.info(`Flyt Sever started on ${config.port}`);
      });
    },
    stop: () => {},
  };
};
