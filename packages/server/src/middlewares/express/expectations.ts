import { Router } from "express";
import { Engine } from "flyt-engine";

export default (engine: Engine) => {
  const router = Router();
  router.get("/", (_, res) => {
    res.status(200).json(engine.expectations);
  });

  router.post("/", (req, res) => {
    try {
      const { expectations } = req.body;
      for (const exp of expectations) {
        engine.addExpectation(exp);
      }
      res.status(201).end();
    } catch (error) {
      res.status(400).json({
        error,
      });
    }
  });

  return router;
};
