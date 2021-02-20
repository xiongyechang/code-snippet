<template>
	<view>
		<Parser class="parse" :tag-style="tagStyle" :html="inputHTML" show-with-animation>
			<view class="loading">
				<view class="loading_wrap">
					<image class="image" src="./assets/loading.gif">
					<text>加载中...</text>
				</view>
			</view>
		</Parser>
	</view>
</template>

<script>
	import marked from 'marked';
	import hljs from 'highlight.js';
	import Parser from "./parser/parser.vue";
	
	export default {
		props:{
			resource:{
				type:String,
				default:""
			}
		},
		components:{
			Parser
		},
		data() {
			return {
				tagStyle: {
				    // 代码块
				    pre: 'overflow: auto;background: #23241f;padding: 0.5rem;border-radius: 0.2rem;'
				},
			}
		},
		computed:{
			inputHTML(){
				return marked(this.resource);
			}
		},
		created(){
			// 初始化markdown高亮效果
			this.initHighLight();
		},
		methods: {
			initHighLight(){
				hljs.configure({useBR: true,tabReplace:' '});
				marked.setOptions({
					renderer: new marked.Renderer(),
					gfm: true,
					tables: true,
					breaks: false,
					pedantic: false,
					highlight: function (code, lang) {
						if (lang && hljs.getLanguage(lang)) {
							// TODO 代码块 使其高亮
							return hljs.highlight(lang, code, true).value;
						} else {
							return hljs.highlightAuto(code).value;
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	// @import url('./highlight.js/styles/monokai-sublime.css');
	// @import url('./assets/default.css');
</style>
