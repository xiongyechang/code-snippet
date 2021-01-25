export const isObject = param =>
  Object.prototype.toString.call(param) === '[object Object]';

export const isArray =
  Array.isArray ||
  function(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  };

export const Object2Querystring = param => {
  let querystring = '?';
  if (isObject(param)) {
    let keys = Object.keys(param);
    let values = Object.values(param);
    for (let i = 0; i < values.length; i++) {
      querystring += keys[i] + '=' + values[i] + '&';
    }
  }
  let len = querystring.length;
  return querystring.substr(0, len - 1);
};

export const isMobile = function() {
  return (
    window.navigator.userAgent
      .toLowerCase()
      .match(
        /(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian | j2me | blackberry | wince)/i
      ) != null
  ); //进行userAgent匹配
};

export const compare = function(p) {
  //这是比较函数
  return function(m, n) {
    var a = m[p];
    var b = n[p];
    return b - a; //升序
  };
};

export const format = function(date, mode = 'yyyy/MM/dd') {
  if (!(date instanceof Date)) {
    return date;
  }
  let str;
  switch (mode) {
    case 'yyyy':
      str = date.getFullYear();
      break;
    case 'yyyy/MM/dd':
      str =
        date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      break;
    case 'yyyy年MM月dd日':
      str =
        date.getFullYear() +
        '年' +
        (date.getMonth() + 1) +
        '月' +
        date.getDate() +
        '日';
      break;
  }
  return str;
};

export function offsetTop(dom, t = 0) {
  if (dom.offsetParent === null) {
    return t;
  } else {
    return offsetTop(dom.offsetParent, dom.offsetTop + t);
  }
}

export function offsetLeft(dom, l = 0) {
  if (dom.offsetParent === null) {
    return l;
  } else {
    return offsetLeft(dom.offsetParent, dom.offsetLeft + l);
  }
}

// export function download() {}

export function random(
  options = {
    size: 1,
    type: 'string', // 生成数字还是字符串
    symbol: false // 生成字符串的话是否包含特殊符号,
  }
) {
  let result = '';
  let size = options.size || 1;
  let type = options.type || 'string';
  let symbol = options.symbol || false;
  let symbols = [
    '-',
    '.',
    '~',
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '_',
    ':',
    '<',
    '>',
    '?'
  ];
  let strings = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ];

  if (type === 'string') {
    let len = 0;
    if (symbol) {
      strings = strings.concat(symbols);
    }
    len = strings.length;
    for (let i = 0; i < size; i++) {
      result += strings[parseInt(Math.random() * len, 10)];
    }
  } else if (type === 'number') {
    let str = Math.random()
      .toString()
      .split('.')[1];
    result = +Array.prototype.slice.call(str, 0, size).join('');
  }
  return result;
}

/**
 * 获取浏览器滚动距离
 */
export function getScrollOffset() {
  if (window.pageXOffset) {
    return {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  } else {
    return {
      x: document.body.scrollLeft + document.documentElement.scrollLeft,
      y: document.body.scrollTop + document.documentElement.scrollTop
    };
  }
}

export function getToken() {
  return localStorage.getItem('access_token');
}
