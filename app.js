const Koa = require('koa');
const app = new Koa();
const env = process.env.NODE_ENV || 'development';

const port = 3000;
const config = require(`./config/env/${env}.config.json`)
const utilities = require("./src/utilities")

//initialize database and clients
utilities.Registry.set("config", config);
utilities.Registry.set("env", env);

let mongoCon = (new utilities.DBClient.MongoDB.Client(config.mongo_instances.primary_1, {})).connect();
console.log({mongoCon})
utilities.Registry.set("mongodb", mongoCon);


app.use(async ctx => {
    ctx.body = 'Hello world';

});



app.listen(port, () => console.log('Server Running'));