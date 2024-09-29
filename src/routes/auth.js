const Router = require("@koa/router");
const Controller = require("../controllers");

let r = new Router();

r.post("/auth/register", async (ctx, next) => {
    let controller = new Controller.Auth(ctx, next);
    await controller.execute('register');
});

r.post("/auth/login", async (ctx, next) => {
    let controller = new Controller.Auth(ctx, next);
    await controller.execute('login');
});

module.exports = r;