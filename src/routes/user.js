const Router = require("@koa/router");
const Controller = require("../controllers");
const authenticateToken = require("../middlewares/authentication.middleware");

let r = new Router();

r.put("/user/update", async (ctx, next) => {
    let controller = new Controller.User(ctx, next);
    await controller.execute('update');
});

r.put("/user/update-password", async (ctx, next) => {
    let controller = new Controller.User(ctx, next);
    await controller.execute('updatePassword');
});
r.post("/user/get-user-bookings", authenticateToken, async (ctx, next) => {
    let controller = new Controller.User(ctx, next);
    await controller.execute('getUserBookings');
})
r.post("/user/update-booking-status", authenticateToken, async (ctx, next) => {
    let controller = new Controller.User(ctx, next);
    await controller.execute('updateBookingStatus');
})
module.exports = r;