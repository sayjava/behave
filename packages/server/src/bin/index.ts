#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { existsSync, readFileSync } from "fs";
import { create, validateBehavior } from "@sayjava/behave-engine";

import server from "../server";

const args = yargs(hideBin(process.argv))
  .option("behaviors", {
    alias: "b",
    describe: "initialize the server with this behavior",
    default: null,
  })
  .option("port", {
    alias: "p",
    describe: "server port",
    default: 8080,
  })
  .option("from-file", {
    alias: "f",
    describe: "JSON file containing array of behaviors",
    default: "behaviors.json",
  })
  .option("debug", {
    alias: "d",
    describe: "Debug level info, verbose",
    default: "info",
  }).argv;

const parseBehaviors = (behaviors: string): any[] => {
  try {
    const strBehaviors: any[] = JSON.parse(behaviors);
    if (!Array.isArray(strBehaviors)) {
      console.error(
        `Behaviors must be an array. see the docs at https://behave.dev`
      );
      console.warn(`No behaviors was loaded`);
      return [];
    }

    for (const be of strBehaviors) {
      validateBehavior(be);
    }

    return strBehaviors;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const loadBehaviors = (args: any): any[] => {
  const { behaviors, fromFile } = args;
  const fileExists = existsSync(fromFile as string);
  if (!behaviors && !fileExists) {
    console.warn(`No behaviors was loaded`);
    console.warn(`see the docs at https://behave.dev`);
    return [];
  }

  if (behaviors) {
    return parseBehaviors(behaviors);
  }

  if (fileExists) {
    return parseBehaviors(readFileSync(fromFile as string).toString());
  }
};

try {
  const behaviors = loadBehaviors(args);

  // Load config and expectations
  server({
    debugLevel: "verbose",
    engine: create({ behaviors, config: { ...args } }),
  }).then((app) => app.start());
} catch (error) {
  console.error(error);
}
