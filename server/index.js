const Koa = require("koa");
const Router = require("koa-router");
const low = require("lowdb");
const koaBody = require("koa-body");
const _ = require("lodash");
const FileAsync = require("lowdb/adapters/FileAsync");
const { download } = require("./localify");
const app = new Koa();
const router = new Router({ prefix: "/self/api" });
const adapter = new FileAsync("db.json");

(async () => {
  app.use(koaBody());
  app.use(async (ctx, next) => {
    await next();
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Headers", "Content-Type");
    ctx.set("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
    ctx.set("Accept", "application/json");
  });

  app.use(router.routes()).use(router.allowedMethods());
  app.use("/songs", koa.static("./songs"));
  const db = await low(adapter);

  db._.mixin({
    insert: function(array, data) {
      array.unshift(data);
    }
  });

  const collection = db.get("songlist");

  const localify = song => {
    if ("localUrl" in song) {
      return;
    }
    download(song.url, song.id, err => {
      if (err) {
        console.error(err);
        return;
      }
      collection
        .find({ id: song.id })
        .assign({ localUrl: song.id })
        .write();
    });
  };

  router.get("/", (ctx, next) => {
    ctx.body = collection.value();
  });

  router.post("/", (ctx, next) => {
    const song = ctx.request.body;
    const res = collection.find({ id: song.id });
    const one = res.value();
    if (!one) {
      collection.insert(song).write();
    } else {
      res.assign(song).write();
    }
    localify(song);
    ctx.body = { result: "OK", code: 200, message: "success" };
  });

  router.put("/", (ctx, next) => {
    const song = ctx.request.body;
    const res = collection.find({ id: song.id });
    const one = res.value();
    if (!one) {
      collection.push(song).write();
    } else {
      res.assign(song).write();
    }
    ctx.body = { result: "OK", code: 200, message: "success" };
  });

  router.del("/", (ctx, next) => {
    const song = ctx.request.query;
    collection.remove({ id: song.id }).write();

    ctx.body = { result: "OK", code: 200, message: "success" };
  });

  router.post("/localify", (ctx, next) => {
    const song = ctx.request.body;
    localify(song);
    ctx.body = { result: "OK", code: 200, message: "success" };
  });

  app.listen(8003, "0.0.0.0", () => {
    console.log("listen to 8003");
  });
})();
