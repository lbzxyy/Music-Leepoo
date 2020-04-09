// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const tcbRouter = require("tcb-router");

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new tcbRouter({ event });
  app.router('playlist', async(ctx, next) => {
    ctx.body = await cloud
    .database()
    .collection("playlist")
    .skip(event.start)
    .limit(event.count)
    .orderBy("createTime", "desc")
    .get()
    .then(res => {
      return res;
    });
  })
  return app.serve()
};
