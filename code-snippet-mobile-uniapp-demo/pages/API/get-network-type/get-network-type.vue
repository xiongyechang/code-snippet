<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view style="background:#FFFFFF; padding:40rpx;">
				<view class="uni-hello-text uni-center">网络状态</view>
				<block v-if="hasNetworkType === false">
					<view class="uni-h2 uni-center uni-common-mt">未获取</view>
					<view class="uni-hello-text uni-center uni-common-mt">请点击下面按钮获取网络状态</view>
				</block>
				<block v-if="hasNetworkType === true">
					<view class="uni-h2 uni-center uni-common-mt">{{networkType}}</view>
				</block>
				<view v-if="hasNetworkType === true && networkType === 'wifi'" class="uni-textarea uni-common-mt">
					<textarea :value="connectedWifi"></textarea>
				</view>
			</view>
			<view class="uni-btn-v uni-common-mt">
				<button type="primary"  @tap="getNetworkType">获取手机网络状态</button>
				<button v-if="hasNetworkType === true && networkType === 'wifi'" class="uni-common-mt" type="primary" @tap="getConnectedWifi">获取 wifi 信息</button>
				<button class="uni-common-mt" @tap="clear">清空</button>
			</view>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				title: 'getNetworkType',
				hasNetworkType: false,
				networkType: '',
				connectedWifi: ''
			}
		},
		onUnload:function(){
			this.networkType = '',this.hasNetworkType = false;
		},
		methods: {
			getNetworkType: function () {
				uni.getNetworkType({
					success: (res) => {
						console.log(res)
						this.hasNetworkType = true, this.networkType = res.subtype || res.networkType
					},
                    fail: () => {
                        uni.showModal({
                        	content:'获取失败！',
                            showCancel:false
                        })
                    }
				})
			},
			clear: function () {
				this.hasNetworkType = false,
				this.networkType = '',
				this.connectedWifi = ''
			},
			getConnectedWifi() {
				const that = this
				uni.startWifi({
					success: function() {
						console.log("=========== startWifi success  =========")
						uni.getConnectedWifi({
							success: function(res) {
								const { wifi } = res
								that.connectedWifi = JSON.stringify(wifi)
							},
							fail: function(res) {
								console.log("=========== getConnectedWifi fail res =========", res)
							}
						})
					},
					fail: function(res) {
						console.log("=========== startWifi fail res =========", res)
					}
				})
			}
		}
	}
</script>

<style>

</style>
