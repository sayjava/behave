import { Behavior, Engine } from "@sayjava/behave-engine";
import { Express } from "express";
import { existsSync, readFileSync } from "fs";
import { parseBehaviors } from "../../utils";
import assert from "./assert";
import behaviors from "./behaviors";
import records from "./records";
import routes from "./routes";

const loadBehaviors = (args: any): any[] => {
  const { behaviors, fromFile } = args;
  const fileExists = existsSync(fromFile as string);
  if (!behaviors && !fileExists) {
    console.warn(`No behaviors was loaded`);
    console.warn(`see the docs at https://behave.dev`);
    return [];
  }

  if (behaviors) {
    return parseBehaviors(JSON.stringify(behaviors));
  }

  if (fileExists) {
    return parseBehaviors(readFileSync(fromFile as string).toString());
  }
};

export interface BehaveConfig {
  fromFile?: string;
  behaviors?: Behavior[];
}

export interface BehaveMiddlewareProps {
  app: Express;
  config: BehaveConfig;
  baseRoute?: string;
}

export default ({ app, config, baseRoute }: BehaveMiddlewareProps): Engine => {
  const loadedBehaviors = loadBehaviors(config);
  const engine = new Engine(loadedBehaviors);

  app.use("/_/api/behaviors", behaviors(engine));
  app.use("/_/api/records", records(engine));
  app.use("/_/api/requests", assert(engine));

  baseRoute ? app.use(baseRoute, routes(engine)) : app.use(routes(engine));
  return engine;
};
