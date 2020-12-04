import { Engine } from "@sayjava/behave-engine";
import { Express } from "express";
import assert from "./assert";
import behaviors from "./behaviors";
import records from "./records";
import routes from "./routes";

export default (app: Express, engine: Engine) => {
  app.use("/_/api/behaviors", behaviors(engine));
  app.use("/_/api/records", records(engine));
  app.use("/_/api/requests", assert(engine));
  app.use(routes(engine));
};
