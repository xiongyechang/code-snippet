import API from '@/api/api'

// 请求七牛云的token
const getQiniuToken = context => {
  API.getQiniuToken().then(response => {
    context.commit('setQiniuToken', response)
  }).catch(() => {})
}

const getQiniuDomain = context => {
  API.getQiniuDomain().then(response => {
    context.commit('setQiniuDomain', response)
  }).catch(() => {})
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
