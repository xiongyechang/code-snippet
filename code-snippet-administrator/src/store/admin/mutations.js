const setQiniuToken = (state, qiniuToken) => {
  state.qiniuToken = qiniuToken;
};

const setQiniuDomain = (state, qiniuDomain) => {
  state.qiniuDomain = qiniuDomain;
};

const setLoginStatus = (state, loginStatus) => {
  state.isLogin = loginStatus;
};

const setUserInfo = (state, userinfo) => {
  state.userInfo = btoa(JSON.stringify(userinfo));
};

export default {
  setQiniuToken,
  setQiniuDomain,
  setLoginStatus,
  setUserInfo
};
