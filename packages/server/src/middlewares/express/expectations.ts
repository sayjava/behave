import { Router } from "express";
import { Engine } from "flyt-engine";

export default (engine: Engine) => {
  const router = Router();
  router.get("/", (_, res) => {
    res.status(200).json(engine.expectations);
  });

  router.delete("/:id", (req, res) => {
    const { id = "" } = req.params;
    engine.removeExpectation(id);
    res.status(201).json({ message: "ok" });
  });

  router.post("/", (req, res) => {
    try {
      const { expectations = [] } = req.body;

      if (!Array.isArray(expectations)) {
        return res.status(400).json({
          message: `Expectations must be an array`,
        });
      }

      for (const exp of expectations) {
        engine.addExpectation(exp);
      }
      res.status(201).json({ message: "ok" });
    } catch (error) {
      res.status(400).json({
        message: error.message,
        actual: error.actual,
        expected: error.expected,
      });
    }
  });

  return router;
};
