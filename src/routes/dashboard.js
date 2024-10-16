const Router = require("@koa/router");
const Controller = require("../controllers");
const authenticateToken = require("../middlewares/authentication.middleware");

let r = new Router();

r.get("/dashboard/get-users", authenticateToken, async (ctx, next) => {
    let controller = new Controller.Dashboard(ctx, next);
    await controller.execute('getUsers');
})

r.get("/dashboard/get-bookings", authenticateToken, async (ctx, next) => {
    let controller = new Controller.Dashboard(ctx, next);
    await controller.execute('getBookings');
})

module.exports = r;