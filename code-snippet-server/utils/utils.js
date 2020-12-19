// 正则
exports.emailExp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
exports.phoneNumberExp = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;

// 方法
exports.random = random;
exports.isEmail = isEmail;
exports.isPhoneNumber = isPhoneNumber;
exports.isUrl = isUrl;
exports.createEmail = createEmail;
exports.createPhoneNumber = createPhoneNumber;

function random(
  options = {
    size: 1,
    type: "string", // 生成数字还是字符串
    symbol: false // 生成字符串的话是否包含特殊符号,
  }
) {
  let result = "";
  let range = 0;
  let size = options.size || 1;
  let type = options.type || "string";
  let symbol = options.symbol || false;
  let symbols = [
    "-",
    ".",
    "~",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    ":",
    "<",
    ">",
    "?"
  ];
  let strings = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];

  if (type === "string") {
    let len = 0;
    if (symbol) {
      strings = strings.concat(symbols);
    }
    len = strings.length;
    for (let i = 0; i < size; i++) {
      result += strings[parseInt(Math.random() * len, 10)];
    }
  } else if (type === "number") {
    let array = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (let i = 0; i < size; i++) {
      let index = Math.floor(Math.random() * 10);
      result += array[index];
    }
    result = Number(result);
  }
  return result;
}

function isEmail(str) {
  return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
    str
  );
}

function isPhoneNumber(str) {
  return /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
    str
  );
}

function isUrl(str_url) {
  // var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
  //              + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
  //              + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
  //              + '|' // 允许IP和DOMAIN（域名）
  //              + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
  //              + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
  //              + '[a-z]{2,6})' // first level domain- .com or .museum
  //              + '(:[0-9]{1,4})?' // 端口- :80
  //              + '((/?)|' // a slash isn't required if there is no file name
  //              + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
  var re = /(?:(https?|ftp|file):)?\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
  return re.test(str_url);
}

function createEmail() {
  let exts = [
    "@qq.com",
    "@163.com",
    "@162.com",
    "@139.com",
    "@hotmail.com",
    "@foxmail.com",
    "@sohu.com",
    "@sina.cn",
    "@outlook.com",
    "@aliyun.com",
    "@msn.com",
    "@tom.com",
    "@gmail.com"
  ];
  return (
    random({ type: "string", symbol: false, size: 8 }).toLowerCase() +
    exts[random({ type: "number", size: 1 })]
  );
}

function createPhoneNumber() {
  var prefixArray = new Array(
    "130",
    "131",
    "132",
    "133",
    "135",
    "137",
    "138",
    "170",
    "187",
    "189"
  );
  var i = parseInt(10 * Math.random());
  var prefix = prefixArray[i];
  for (var j = 0; j < 8; j++) {
    prefix = prefix + Math.floor(Math.random() * 10);
  }
  return prefix;
}
