<template>
	<view class="page">
		<scroll-view class="tab-bar scroll-h" :scroll-x="true" :show-scrollbar="true" :scroll-into-view="scrollInto">
			<view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap(tab, index)">
				<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
			</view>
		</scroll-view>
		<uni-search-bar class="page-header" radius="100" placeholder="请输入搜索内容..." clearButton="none" cancelButton="none" @confirm="search" @input="input"/>
		<uni-list>
			<uni-list-chat v-for="item in listData" :key="item.id" @click="rowClickHandler(item)" :title="item.title" :avatar="item.cover" :note="item.note" :link="true" :clickable="true" badge-positon="left" :badge-text="item.content">
				<view class="chat-custom-right">
					<text class="title-text">{{ formatDate(item.createdAt, "YYYY-MM-DD") }}</text>
				</view>
			</uni-list-chat>
		</uni-list>
	</view>
</template>

<script>
import UniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
import UniListChat from '@/components/uni-list-chat/uni-list-chat.vue';
import API from '@/api/api';

import Mixin from '@/mixins/mixin';

const CODE_SNIPPET_DETAILS_PAGE = `/pages/code-snippet-details/code-snippet-details`;

export default {
	components: {
		UniSearchBar,
		UniListChat
	},
  data () {
    return {
			reload: false,
			listData: [],
			page: 1,
			limit: 20,
			total: 0,
			tabBars: [],
			scrollInto: '',
			tabIndex: 0,
		}
  },
  onLoad () {
		console.log("onLoad...");
	},
	onPullDownRefresh () {
		
	},
	onReachBottom () {
		console.log("触底了");
		if(this.listData.length < this.total) {
			this.page++;
			this.fetchData(this.page, this.limit, true);
		} else {
			uni.showToast({
				icon: "none",
				mask: true,
				title: "没有更多数据了",
				duration: 3000
			})
		}
	},
	beforeCreate () {
		console.log("beforeCreate...");
	},
	created () {
		console.log("created...");
	},
	mixins: [Mixin],
	mounted () {
		this.getCodeCategories()
		this.fetchData()
	},
  methods: {
		async getCodeCategories() {
			const { rows, count } = await API.getCodeCategories();
			this.tabBars = rows.map((row,index) => ({
				index,
				_id: row._id,
				id: row.title,
				name: row.title
			}))
		},
		async fetchData(page = 1, limit = 20, loadMore = false) {
			const { rows, count } = await API.getCodeSnippets(page, limit);
			if(loadMore) {
				this.listData = this.listData.concat(this.formatData(rows));
			} else {
				this.listData = this.formatData(rows);
				this.total = count;
			}
		},
		formatData (rows) {
			return rows.map(row => ({
				id: row._id,
				title: row.title,
				note: row.summary,
				cover: row.category.avatar,
				post_id: row._id,
				published_at: row.createdAt
			}))
		},
		async rowClickHandler (row) {
			uni.navigateTo({
				url: `${CODE_SNIPPET_DETAILS_PAGE}?_id=` + row.id
			})
		},
		async input ({value}) {
			if(value === '') {
				this.fetchData();
			}
		},
		async search ({value}) {
			if(value.trim()){
				const { rows, count } = await API.searchCodeSnippet(value);
				this.listData = this.formatData(rows);
				this.total = count;
			}else{
				uni.showToast({
					icon: "none",
					mask: true,
					title: "请输入搜索内容",
					duration: 3000
				})
			}
		},
		ontabtap (tab, index) {
			if (this.tabIndex === index) {
			    return;
			}
			this.tabIndex = index;
			this.scrollInto = this.tabBars[index].id;
			console.log(tab);
		}
  }
}
</script>

<style lang="scss" scoped>
	.page {
		display: flex;
		flex-direction: column;
		&-header {
			position: sticky;
			top: 0;
			right: 0;
			left: 0;
			z-index: 999;
		}
		&-body {
			flex: 1;
		}
	}
	
	.tabs {
	    flex: 1;
	    flex-direction: column;
	    overflow: hidden;
	    background-color: #ffffff;
	    /* #ifdef MP-ALIPAY || MP-BAIDU */
	    height: 100vh;
	    /* #endif */
	}
	
	.scroll-h {
		display: flex;
		width: 750rpx;
		height: 80rpx;
		flex-direction: row;
		white-space: nowrap;
		overflow: auto;
		// background: lightgray;
		position: sticky;
		top: 0rpx;
		z-index: 999;
	}
	
	.uni-tab-item {
	    display: inline-block;
	    flex-wrap: nowrap;
	    padding-left: 34rpx;
	    padding-right: 34rpx;
	}
	
	.uni-tab-item-title {
	    color: #555;
	    font-size: 30rpx;
	    height: 80rpx;
	    line-height: 80rpx;
	    flex-wrap: nowrap;
	    /* #ifndef APP-PLUS */
	    white-space: nowrap;
	    /* #endif */
	}
	
	.uni-tab-item-title-active {
	    color: #007AFF;
	}
	
	.title-text {
		color: gray;
		font-size: 24rpx;
	}
</style>
