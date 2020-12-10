import { Behavior, validateBehavior } from "@sayjava/behave-engine";
import formidable from "formidable";
import { existsSync, readFileSync } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import path from "path";

export interface BehaveConfig {
  fromFile?: string;
  behaviors?: Behavior[];
}

export const parseBehaviors = (behaviors: string): Behavior[] => {
  const strBehaviors: any[] = JSON.parse(behaviors);

  if (!Array.isArray(strBehaviors)) {
    throw new Error("Behaviors must be an array");
  }
  const validatedBehaviors = strBehaviors.map(validateBehavior);
  return validatedBehaviors;
};

export const loadBehaviors = (args: BehaveConfig): any[] => {
  const { behaviors, fromFile } = args;

  const filePath = path.join(path.resolve(process.cwd(), fromFile || ""));
  const fileExists = existsSync(filePath);

  if (!behaviors && !fileExists) {
    console.warn(`No behaviors was loaded`);
    console.warn(`see the docs at https://behave.dev`);
    return [];
  }

  if (behaviors) {
    return parseBehaviors(JSON.stringify(behaviors));
  }

  if (fileExists) {
    return parseBehaviors(readFileSync(filePath).toString());
  }
};

export const parseBody = (
  req: IncomingMessage,
  multiples = false
): Promise<{ fields: any; files: any[] }> => {
  const form = formidable({
    multiples,
    enabledPlugins: ["octetstream", "querystring", "json"],
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      return resolve({ fields, files });
    });
  });
};

interface JSONProps {
  status: number;
  res: ServerResponse;
  body: any;
}

export const sendJson = ({ status, res, body }: JSONProps) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.write(JSON.stringify(body));
  return res.end();
};
