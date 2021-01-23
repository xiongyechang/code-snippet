import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  qiniuToken: undefined,
  qiniuDomain: undefined,
  isLogin: false,
  userInfo: null,
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
