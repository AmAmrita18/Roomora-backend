const Router = require("@koa/router");
const Controller = require("../controllers");
const authenticateToken = require("../middlewares/authentication.middleware");
const {uploadImages, cloudinaryUpload} = require("../middlewares/uploadImages")

let r = new Router();

r.post("/hotel/add-hotel", async (ctx, next) => {
    let controller = new Controller.Hotels(ctx, next);
    await controller.execute('addHotel');
});

r.put("/hotel/update-hotel", async (ctx, next) => {
    let controller = new Controller.Hotels(ctx, next);
    await controller.execute('updateHotel');
});

r.get("/hotel/get-hotels", async (ctx, next) => {
    let controller = new Controller.Hotels(ctx, next);
    await controller.execute('getHotels');
})

r.post("/hotel/get-hotel",  async (ctx, next) => {
    let controller = new Controller.Hotels(ctx, next);
    await controller.execute('getHotel')
})

r.post("/hotel/book-hotel", async (ctx, next) => {
    let controller = new Controller.Hotels(ctx, next);
    await controller.execute('bookHotel')
})

r.post("/hotel/delete-hotel", async (ctx, next) => {
    let controller = new Controller.Hotels(ctx, next);
    await controller.execute('deleteHotel')
})


module.exports = r;