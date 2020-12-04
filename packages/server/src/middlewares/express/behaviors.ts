import { Router } from "express";
import { Engine } from "@sayjava/behave-engine";

export default (engine: Engine) => {
  const router = Router();
  router.get("/", (_, res) => {
    res.status(200).json(engine.behaviors);
  });

  router.delete("/:id", (req, res) => {
    const { id = "" } = req.params;
    engine.removeBehavior(id);
    res.status(201).json({ message: "ok" });
  });

  router.post("/", (req, res) => {
    try {
      const behaviors = req.body;

      if (!Array.isArray(behaviors)) {
        return res.status(400).json({
          message: `Behaviors must be an array`,
        });
      }

      for (const behave of behaviors) {
        engine.addBehavior(behave);
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
