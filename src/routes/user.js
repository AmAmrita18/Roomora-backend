const Router = require("@koa/router");
const Controller = require("../controllers");

let r = new Router();

r.put("/user/update", async (ctx, next) => {
    let controller = new Controller.User(ctx, next);
    await controller.execute('update');
});

r.put("/user/update-password", async (ctx, next) => {
    let controller = new Controller.User(ctx, next);
    await controller.execute('updatePassword');
});

module.exports = r;