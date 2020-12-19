// const Redis = require("ioredis");

// const redis = new Redis({
// 	port: 6379, // Redis port
//   host: "47.94.162.34", // Redis host
//   family: 4, // 4 (IPv4) or 6 (IPv6)
//   password: "U2FsdGVkX18J3ipQx8gZf1ltiXcc2RpOU/RZapMobDE=",
//   db: 0
// });

// redis.set('key', 'value');

// redis.expire('key', 10); // 设置过期时间为1秒

// redis.get('key').then(value => {
// 	console.log('47.94.162.34:6379 连接成功');
// })

// redis.set('obj', JSON.stringify({ a: 1, b: 2 })); // redis 无法存储 json 对象, 需要转换为 JSON 字符串

// redis.get('obj').then(value => {
// 	console.log(value);
// })

// module.exports = redis;
