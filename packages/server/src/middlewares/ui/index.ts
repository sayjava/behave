import express, { Express } from "express";
import next from "next";

export default async (server: Express) => {
  const dev = process.env.NODE_ENV !== "production";
  const app = next({ dev });
  const handler = app.getRequestHandler();

  server.use(express.static("../../.next"));
  server.get("/service-worker.js", (req, res) => {
    res.status(404).end();
  });

  return app.prepare().then(() =>
    server.use("/_/ui", (req, res) => {
      handler(req, res);
    })
  );
};
