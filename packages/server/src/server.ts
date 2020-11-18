import express, { Express } from "express";
import morgan from "morgan";

interface ServerConfig {
  port?: number;
  keepAlivePath?: string;
  debugLevel?: "none" | "verbose";
  expectations: any[];
}

const defaultConfig: ServerConfig = {
  port: 8080,
  expectations: [],
  keepAlivePath: "/_alive",
  debugLevel: "none",
};

const createRestRoute = (app: Express) => {
  app
    .route("/_/api/expectations")
    .get((req, res) => {
      res.send([]);
    })
    .post((req, res) => {
      res.send("created ok");
    })
    .delete((req, res) => {
      res.send("deleted ok");
    })
    .put((req, res) => {
      res.send("deleted ok");
    });
};

const createKeepAliveRoute = (app: Express, path: string) => {
  app.get(path, (req, res) => {
    res.status(200).send("Ok");
  });
};

const createExpectationRoute = (app: Express) => {
  app.use((req, res) => {
    res.send({
      message: req.path,
    });
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
  const config = Object.assign({}, defaultConfig, argConfig);

  return {
    start: () => {
      enableLogging(app, config);
      createKeepAliveRoute(app, config.keepAlivePath);
      createRestRoute(app);
      createExpectationRoute(app);

      app.listen(config.port, () => {
        console.info(`Flyt Sever started on ${config.port}`);
      });
    },
    stop: () => {},
  };
};
