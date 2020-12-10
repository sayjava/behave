import { Engine, Verification } from "@sayjava/behave-engine";
import { IncomingMessage, ServerResponse } from "http";
import { parseBody, sendJson } from "../utils";

export default (engine: Engine) => async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  switch (req.method) {
    case "PUT":
      try {
        const { fields } = await parseBody(req);
        const behaviors = Object.values(fields);

        const verified = behaviors.map((verify: Verification) =>
          engine.assert(verify)
        );

        const passed = verified.filter((res) => typeof res !== "boolean");
        if (passed.length !== 0) {
          return sendJson({ res, status: 406, body: passed });
        }

        return sendJson({ res, status: 202, body: {} });
      } catch (error) {
        console.error(error);
        return sendJson({ res, status: 400, body: error });
      }

      break;

    default:
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Only PUT method is supported" }));
      return res.end();
  }
};
