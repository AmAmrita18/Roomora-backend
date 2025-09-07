const _ = require("lodash");
const env = process.env.NODE_ENV || "development";
const config = require(`./config/env/${env}.config.json`);
const utilities = require("./src/utilities");

utilities.Registry.set("config", config);
utilities.Registry.set("env", env);

// initialize database and clients
let mongoCon = new utilities.DBClient.MongoDB.Client(
  config.mongo_instances.primary_1,
  null
).connect();
utilities.Registry.set("mongodb", mongoCon);

// initializing models on the mongodb connection
const schemaList = require("./src/models");
utilities.Registry.set("schemas", schemaList);
let models = {};
_.each(schemaList, (value, key) => {
  models[key] = mongoCon.model(key, value.schema.schema);
});
utilities.Registry.set("models", models);

const Koa = require("koa");
const { koaBody } = require("koa-body");
const app = new Koa();
require("koa-qs")(app, "extended");

app.use(koaBody());
app.use(async (ctx, next) => {
  try {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "*");
    ctx.set("Access-Control-Allow-Headers", "*");
    await next();
  } catch (error) {
    console.log("Process.Error", error);
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message:
        "Internal Server error, dev team has been notified. Please try again after sometime!!",
    };
    ctx.app.emit("error", error);
  }
});

// route middleware and initialization
const routesList = require("./src/routes");
_.each(routesList, (router) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

// 👉 Export for Vercel (Serverless)
if (process.env.VERCEL) {
  module.exports = app.callback();
} else {
  // 👉 Local Development
  const PORT = process.env.PORT || 1111;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
