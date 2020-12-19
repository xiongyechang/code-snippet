const { qiniu } = require('../config/config')

class Qiniu {
	static AccessKey = qiniu.AccessKey
	static SecretKey = qiniu.SecretKey
	static bucket = qiniu.bucket
	static domain = qiniu.domain
}

module.exports = Qiniu