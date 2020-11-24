import { safeLoad } from "js-yaml";
import { readFileSync } from "fs";
import { create } from "flyt-engine";

import server from "../server";

try {
  const todos = safeLoad(readFileSync("./fixtures/todo.yml"), "utf-8");

  // Load config and expectations
  server({
    debugLevel: "verbose",
    engine: create({ expectations: todos.expectations }),
  }).then((app) => app.start());
} catch (error) {
  console.error(error);
}
