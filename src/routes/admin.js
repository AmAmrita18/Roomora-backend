const Router = require("@koa/router");
const Controller = require("../controllers");
const authenticateToken = require("../middlewares/authentication.middleware");

let r = new Router();

r.put("/admin/update-admin", authenticateToken, async (ctx, next) => {
    let controller = new Controller.Admin(ctx, next);
    await controller.execute('update');
});

r.put("/admin/update-user-status", authenticateToken, async (ctx, next) => {
    let controller = new Controller.Admin(ctx, next);
    await controller.execute('updateUserStatus');
})

r.put("/admin/update-booking-status", authenticateToken, async (ctx, next) => {
    let controller = new Controller.Admin(ctx, next);
    await controller.execute('updateBookingStatus');
})

r.put("/admin/update-password", authenticateToken, async (ctx, next) => {
    let controller = new Controller.Admin(ctx, next);
    await controller.execute('updatePassword');
})

module.exports = r;