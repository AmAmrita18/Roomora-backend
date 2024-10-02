const Router = require("@koa/router");
const Controller = require("../controllers");

let r = new Router();

r.post("/hotel/add-hotel", async (ctx, next) => {
    let controller = new Controller.Hotels(ctx, next);
    await controller.execute('addHotel');
});

// r.put("/user/update-password", async (ctx, next) => {
//     let controller = new Controller.User(ctx, next);
//     await controller.execute('updatePassword');
// });

module.exports = r;