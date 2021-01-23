const {
	qiniu
} = require('../config/config')
const {
	auth,
	conf,
	zone,
	rs
} = require("qiniu");

class Qiniu {
	static AccessKey = qiniu.AccessKey
	static SecretKey = qiniu.SecretKey
	static bucket = qiniu.bucket
	static domain = qiniu.domain

	static bucket2 = qiniu.bucket2
	static domain2 = qiniu.domain2

	static async list({
		limit = 10,
		prefix,
		marker
	}) {
		var mac = new auth.digest.Mac(Qiniu.AccessKey, Qiniu.SecretKey);
		var config = new conf.Config();
		config.zone = zone.Zone_z0;
		var bucketManager = new rs.BucketManager(mac, config);
		return new Promise((resolve, reject) => {
			bucketManager.listPrefix(Qiniu.bucket2, {
				limit,
				prefix,
				marker
			}, function (err, respBody, respInfo) {
				if (err) {
					reject(err);
				}
				if (respInfo.statusCode == 200) {
					resolve({
						respBody,
						respInfo
					})
				}
			})
		});
	}
}

module.exports = Qiniu