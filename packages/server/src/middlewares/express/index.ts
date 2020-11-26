import { Express } from "express";
import { Engine } from "flyt-engine";
import expectations from "./expectations";
import records from "./records";
import verify from "./verify";
import routes from "./routes";

export default (app: Express, engine: Engine) => {
  app.use("/_/api/expectations", expectations(engine));
  app.use("/_/api/records", records(engine));
  app.use("/_/api/verify", verify(engine));
  app.use(routes(engine));
};
