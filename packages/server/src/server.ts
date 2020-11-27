import bodyParser from "body-parser";
import express, { Express } from "express";
import { Engine } from "flyt-engine";
import morgan from "morgan";
import flyMiddleware from "./middlewares/express";

interface ServerConfig {
  port?: number;
  keepAlivePath?: string;
  readyPath?: string;
  engine: Engine;
  debugLevel?: "none" | "verbose";
}

const defaultConfig: ServerConfig = {
  port: 8080,
  engine: new Engine([]),
  keepAlivePath: "/_alive",
  readyPath: "/_ready",
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
      app.use(
        morgan("common", {
          skip: (req, _) => req.path.includes("/_next"),
        })
      );
      break;
  }
};

export default async (argConfig: ServerConfig) => {
  const config = Object.assign({}, defaultConfig, argConfig);

  const app = express();
  app.use(bodyParser.json());
  app.use("/_ui/", express.static("node_modules/flyt-ui/.next/server/pages"));
  app.use("/_next/", express.static("node_modules/flyt-ui/.next"));
  app.use("/service-worker.js", express.static("node_modules/flyt-ui/.next"));

  enableLogging(app, config);
  createKeepAliveRoute(app, config.keepAlivePath);
  createKeepAliveRoute(app, config.readyPath);

  flyMiddleware(app, config.engine);

  return {
    app,
    start: async () => {
      app.listen(config.port, () => {
        console.info(`Flyt Server started on ${config.port}`);
      });
    },
    stop: () => {},
  };
};
