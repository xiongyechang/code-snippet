class Http {
	get(url) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				success: function(response){
					const { cookies, errMsg, header, statusCode, data: result } = response;
					if ([200, 304].includes(statusCode)) {						
						const { code, message, data } = result;
						if (code === 200) {
							resolve(data)
						} else {
							uni.showToast({
								title: message
							})
						}
					} else {
						console.error(response)
					}
				},
				fail: reject
			})
		})
	}
	
	post(url, data) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				method: 'POST',
				data: data,
				dataType: 'JSON',
				success: function(response){
					const { cookies, errMsg, header, statusCode, data: result } = response;
					if ([200, 304].includes(statusCode)) {						
						const { code, message, data } = result;
						if (code === 200) {
							resolve(data)
						} else {
							uni.showToast({
								title: message
							})
						}
					}
				},
				fail: reject
			})
		})
	}
}

export default new Http()