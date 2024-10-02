const Router = require("@koa/router");
const Controller = require("../controllers");

let r = new Router();

r.put("/admin/update-admin", async (ctx, next) => {
    let controller = new Controller.Admin(ctx, next);
    await controller.execute('update');
});

module.exports = r;