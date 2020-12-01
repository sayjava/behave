import { Router } from "express";
import { Engine } from "behave-engine";

export default (engine: Engine) => {
  const router = Router();
  router.get("/", (_, res) => {
    res.status(200).json(engine.records);
  });

  return router;
};
