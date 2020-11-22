import { Router } from "express";
import { Engine, Verification } from "flyt-engine";

export default (engine: Engine) => {
  const router = Router();

  router.put("/", (req, res) => {
    try {
      const { verifications } = req.body;

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
