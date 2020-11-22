import next from "next";
import { Express } from "express";

export default async (express: Express) => {
  const dev = process.env.NODE_ENV !== "production";
  const app = next({ dev });
  const handler = app.getRequestHandler();
  return app.prepare().then(() =>
    express.use("/_/ui", (req, res) => {
      handler(req, res);
    })
  );
};
