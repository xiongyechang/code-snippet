import API from '@/api/api'
import { HttpResponseCode } from '@/constants/constants';

// 请求七牛云的token
const getQiniuToken = context => {
  API.getQiniuToken().then(({ code, data }) => {
    if (code === HttpResponseCode.OK) {
      context.commit('setQiniuToken', data);
    }
  }).catch(console.error)
}

const getQiniuDomain = context => {
  API.getQiniuDomain().then(({ code, data }) => {
    if (code === HttpResponseCode.OK) {
      context.commit('setQiniuDomain', data);
    }
  }).catch(console.error)
}

const setLoginStatus = ({
  commit
}, loginStatus) => {
  return new Promise((resolve) => {
    commit('setLoginStatus', loginStatus);
    resolve();
  })
}

export default {
  getQiniuToken,
  getQiniuDomain,
  setLoginStatus
}
