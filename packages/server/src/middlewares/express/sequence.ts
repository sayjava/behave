import { Router } from "express";
import { Engine } from "behave-engine";

export default (engine: Engine) => {
  const router = Router();

  router.post("/", (req, res) => {
    try {
      const { requests = [] } = req.body || {};
      const result = engine.verifySequence(requests);

      if (result === true) {
        return res.status(202).send({});
      }

      return res.status(406).json(result);
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  });

  return router;
};
