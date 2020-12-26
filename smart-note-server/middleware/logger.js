exports.logger = async (ctx, next) => {
  let date = new Date();
  let logInfo =
    date.getFullYear() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  console.log(`${logInfo}  ${ctx.request.method} ${ctx.request.url}`)
  await next();
};
