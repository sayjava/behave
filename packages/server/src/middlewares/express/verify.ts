import { Router } from "express";
import { Engine, Verification } from "behave-engine";

const sequence = (engine: Engine, router) => {
  router.put("/sequence", (req, res) => {
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

const exists = (engine: Engine, router) => {
  router.put("/exists", (req, res) => {
    try {
      const { verifications = [] } = req.body;

      if (verifications.length === 0) {
        return res.status(406).send({
          message: "Verifications are empty",
        });
      }

      const verified = verifications.map((verify: Verification) =>
        engine.verify(verify)
      );
      const pass = verified.filter((res) => typeof res !== "boolean");

      if (pass.length !== 0) {
        return res.status(406).send(pass);
      }

      return res.status(202).send({});
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  });

  return router;
};

export default (engine: Engine) => {
  const router = Router();
  exists(engine, router);
  sequence(engine, router);
  return router;
};
