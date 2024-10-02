const Router = require("@koa/router");
const Controller = require("../controllers");

let r = new Router();

//register user
r.post("/auth/register", async (ctx, next) => {
    let controller = new Controller.Auth(ctx, next);
    await controller.execute('register');
});

//login user
r.post("/auth/login", async (ctx, next) => {
    let controller = new Controller.Auth(ctx, next);
    await controller.execute('login');
});

//register admin
r.post("/auth/register-admin", async (ctx, next) => {
    let controller = new Controller.Auth(ctx, next);
    await controller.execute('registerAdmin');
})

//login admin
r.post("/auth/login-admin", async (ctx, next) => {
    let controller = new Controller.Auth(ctx, next);
    await controller.execute('loginAdmin');
});

module.exports = r;