<template>
	<view>
		<uni-search-bar radius="100" placeholder="请输入搜索内容..." clearButton="none" cancelButton="none" @confirm="search" />
		<view>
			
		</view>
	</view>
</template>

<script>
import UniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
export default {
  data () {
    return {}
  },
  onLoad () {
		console.log(111)
	},
	beforeCreate () {
		console.log("222")
	},
  methods: {
		search ({value}) {
			if(value.trim()){
				console.log(value);
			}else{
				uni.showToast({
					icon: "none",
					mask: true,
					title: "请输入搜索内容",
					duration: 3000
				})
			}
		}
  }
}
</script>

<style lang="scss" scoped>
</style>
