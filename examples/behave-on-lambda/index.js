const { behaveHandler } = require("@sayjava/behave");
const serverless = require("serverless-http");
const express = require("express");

const app = express();
app.use(behaveHandler({ config: { fromFile: "behaviors.json" } }));

module.exports.handler = async (evt, context) => {
  const res = await serverless(app)(evt, context);
  return res;
};
