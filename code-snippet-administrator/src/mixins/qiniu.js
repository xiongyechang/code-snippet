import * as qiniu from 'qiniu-js';
import { mapGetters, mapActions } from 'vuex';
import randomstring from 'randomstring';

export default {
  data() {
    return {};
  },
  created() {
    this.getQiniuToken();
    this.getQiniuDomain();
  },
  computed: {
    ...mapGetters({
      qiniuToken: 'admin/qiniuToken',
      qiniuDomain: 'admin/qiniuDomain'
    })
  },
  methods: {
    ...mapActions({
      getQiniuToken: 'admin/getQiniuToken',
      getQiniuDomain: 'admin/getQiniuDomain'
    }),

    uploadToQiniu(file) {
      return new Promise((resolve, reject) => {
        let key = randomstring.generate({capitalization: 'lowercase', length: 8 }) + '-' + file.name;
        let config = {
          useCdnDomain: true,
          region: qiniu.region.z0
        };

        var putExtra = {
          fname: file.name,
          params: {},
          mimeType: [] || null
        };
        var observable = qiniu.upload(
          file,
          key,
          this.qiniuToken,
          putExtra,
          config
        );

        // var subscription = observable.subscribe(observer) // 上传开始
        observable.subscribe(
          res => {
            console.log('上传进度:', res);
          },
          () => {
            reject();
          },
          res => {
            resolve(this.qiniuDomain + '/' + res.key);
          }
        );
      });
    }
  }
};
