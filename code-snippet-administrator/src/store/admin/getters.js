const qiniuToken = state => state.qiniuToken;

const qiniuDomain = state => state.qiniuDomain;

const userInfo = state => state.userInfo && JSON.parse(atob(state.userInfo));
export default {
  qiniuToken,
  qiniuDomain,
  userInfo
};
