import { Engine } from "@sayjava/behave-engine";
import { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "../utils";

export default (engine: Engine) => (
  _: IncomingMessage,
  res: ServerResponse
) => {
  return sendJson({ status: 200, res, body: engine.records });
};
