<template>
    <div class="admin-page">
        <el-row class="row row1">
            <el-col :span="24">
                <i class="el-icon-s-unfold" style="padding: 0 10px;" @click="showDrawer"></i>
                <el-button type="primary" icon="el-icon-s-promotion">发布</el-button>
                <el-button type="danger" icon="el-icon-download" @click="saveMarkdown">保存</el-button>
            </el-col>
        </el-row>
        <el-row class="row row2">
            <el-col class="row2-col1" :span="24">
                <mavon-editor id="editor" v-model="content" @imgAdd="addImg" @save="save"/>
            </el-col>
        </el-row>
        <el-drawer
            :append-to-body="true"
            title="我是标题"
            :visible.sync="drawer"
            direction="ltr"
            :with-header="false">
            <code-snippet-list :data="list" @row-clicked="rowClicked"></code-snippet-list>
        </el-drawer>
    </div>
</template>

<script>
import API from '@/api/api'
import CodeSnippetList from '@/components/code-snippet-list.vue'
import marked from 'marked'
import _ from 'lodash'
import hljs from 'highlight.js'
import xss from 'xss'
import { parse } from 'flowchart.js'
import { shell } from 'electron'
import fs from 'fs'


export default {
    name: "admin",
    components : { CodeSnippetList },
    data () {
        return {
            content: '',
            drawer: false,
            list:[]
        }
    },
    computed: {
        compiledMarkdown () {
            return marked(this.content)
        }
    },
    directives: {
        highlight: function(el) {
            let blocks = el.querySelectorAll('pre code');
            blocks.forEach(block => {
                hljs.highlightBlock(block);
            });
        }
    },
    created () {
        var renderer = new marked.Renderer();

        renderer.code = (code, language) => {
            if (language === 'flow') {// 流程图
                const dom = document.createElement('div');
                const flowchart = parse(code);
                flowchart.drawSVG(dom);
                return dom.innerHTML;
            } else {
                // 默认解析
                return xss(`<pre class="hljs"><code class="${language}">${hljs.highlightAuto(code).value}</code></pre>`)
            }
        }

        marked.setOptions({
            renderer,
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function (code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    // TODO 代码块 使其高亮
                    return hljs.highlight(lang, code, true).value;
                } else {
                    return hljs.highlightAuto(code).value;
                }
            }
        });

        this.getCodeSnippets();
    },
    methods: {
        async getCodeSnippets (page = 1, limit = 20) {
            const { rows, count } = await API.getCodeSnippets(page, limit)
            console.log(rows, count);
            this.list = this.formatData(rows);
        },
        formatData (rows) {
			return rows.map(row => ({
                ...row,
				avatar: row.category.avatar
			}))
		},
        input : _.debounce(function(e) {
            this.content = e.target.value
        }, 300),
        markdownClicked (event) {
            event.preventDefault();
            const element = event.target;
            if(element && element.tagName.toLowerCase() === 'a'){
                shell.openExternal(element.href)
            }
        },
        saveMarkdown () {
            fs.writeFileSync("./markdown.md", this.content);
        },
        showDrawer () {
            this.drawer = true
        },
        rowClicked (row) {
            console.log(row);
            this.content = row.content;
        },
        addImg(file){
            console.log(file);
        },
        save (html) {
            console.log(html);
        }
    }
}
</script>

<style lang="css" scoped>
.admin-page {
    height: 100%;
    width: 100%;
}
.row {
    display: flex;
    margin: 0 !important;
}

.row1 {
    padding: 10px 0;
    background: lightblue;
}

.row2 {
    height: calc(100% - 48px);
}

.row2-col1 {
    padding: 0 !important;
    margin: 0 !important;
    height: 100%;
}

#editor {
    height: 100%;
}
</style>