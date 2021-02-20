<template>
	<view class="page">
		<view class="header">
			<view class="header-title__block">{{ data.title }}</view>
			<view class="header-block horizontal">
				<view class="horizontal">
					<view class="padding10">
						<uni-icons type="eye-filled" color="#409EFF" size="16" />
						<text class="title-text">: {{ data.viewed }}</text>
					</view>
					<view class="padding10">
						<uni-icons type="hand-thumbsup-filled" color="#67C23A" size="16" />
						<text class="title-text">: {{ data.liked }}</text>
					</view>
					<view class="padding10">
						<uni-icons type="heart-filled" color="#F56C6C" size="16" />
						<text class="title-text">: {{ data.collected }}</text>
					</view>
				</view>
				<view>
					<uni-icons type="paperplane-filled" color="#E6A23C" size="16" />
					<text class="title-text">: {{ formatDate(data.createdAt, "YYYY-MM-DD") }}</text>
				</view>
			</view>
		</view>
		<view class="neck">
			<view>{{ data.summary }}</view>
		</view>
		<view class="body">
			<MDParserHighlight :resource="data.content"></MDParserHighlight>
		</view>
		<view class="footer">
				<uni-fav :checked="true" class="favBtn" :circle="true" bg-color="#dd524d" bg-color-checked="#007aff" fg-color="#ffffff" fg-color-checked="#ffffff" @click="favClick(2)" />
		</view>
	</view>
</template>

<script>
import API from '@/api/api';
import MDParserHighlight from '@/components/cmder-MDParserHighlight/index.vue';
import Mixin from '@/mixins/mixin';

export default {
	onLoad: function (option) {	
		this._id = option._id;
	},
	components: {
		MDParserHighlight
	},
	data () {
		return {
			_id: "",
			data: {},
			checkList: [false, false, false, false, false, false]
		}
	},
	created () {
		this.fetchData(this._id);
	},
	mixins: [Mixin],
	mounted () {},
	methods: {
		async fetchData (_id) {
			this.data = await API.getCodeSnippet(_id);
		},
		async favClick (index) {
			console.log(index);
			this.checkList[index] = !this.checkList[index];
		}
	}
}
</script>

<style lang="scss">
	@import url("@/static/css/monokai-sublime.css");
	@import url("@/static/css/prism.css");
	
	.horizontal {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.padding10{
		padding: 0 10rpx;
	}
	
	.title-text {
		color: lightgray;
	}
	
	.page {
		padding: 16rpx;
	}
	
	.header {
		&-title__block {
			font-size: 42rpx;
			font-weight: 700;
			margin: 20rpx 0;
		}
	}
	
	.neck {
		margin: 20rpx 0;
		color: gray;
		padding: 10rpx;
		border-radius: 10rpx;
		text-indent: 2rem;
		background-color: #e6e6e6;
	}
	
	h1 {
		font-size: 42rpx !important;
		font-weight: 700;
	}
</style>
