<template>
    <div class="admin-page">
        <el-row class="row row1">
            <el-col :span="24">
                <i class="el-icon-s-unfold" style="padding: 0 10px;" @click="showDrawer"></i>
                <el-button type="primary" icon="el-icon-s-promotion" @click="publish">发布</el-button>
                <el-button type="danger" icon="el-icon-download" @click="saveMarkdown">保存</el-button>
            </el-col>
        </el-row>

        <el-row class="row row2">
            <el-col class="row2-col1" :span="18">
                <mavon-editor id="editor" v-model="content" @imgAdd="addImg" @save="save"/>
            </el-col>
            <el-col :span="6" style="padding: 20px 10px;">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="标题">
                        <el-input type="text" v-model="form.title" required></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" v-model="form.summary" required></el-input>
                    </el-form-item>
                    <el-form-item label="可用性">
                         <el-switch v-model="form.disabled" required></el-switch>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="form.category" style="width: 100%;" placeholder="请选择分类">
                            <el-option v-for="item of categories" :key="item._id" :label="item.title" :value="item._id">
                                <code-category :data="item"></code-category>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上一篇">
                        <el-select v-model="form.prev" style="width: 100%;" placeholder="请选择上一篇">
                            <el-option v-for="item of list" :key="item._id" :label="item.title" :value="item._id">
                                <code-category :data="item"></code-category>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="下一篇">
                        <el-select v-model="form.next" style="width: 100%;" placeholder="请选择下一篇">
                            <el-option v-for="item of list" :key="item._id" :label="item.title" :value="item._id">
                                <code-category :data="item"></code-category>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
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
import CodeCategory from '@/components/code-category.vue'
import marked from 'marked'
import _ from 'lodash'
import hljs from 'highlight.js'
import xss from 'xss'
import { parse } from 'flowchart.js'
import { shell } from 'electron'
import fs from 'fs'

export default {
    name: "admin",
    components : { CodeSnippetList, CodeCategory },
    data () {
        return {
            content: '',
            drawer: false,
            list:[],
            note: null,
            form: {
                title: '',
                summary: '',
                disabled: false,
                category: '',
                prev: '',
                next: '',
                relations: []
            },
            rules: {
                title: [{ required: true, trigger: "blur", message: "请填写标题" }],
                summary: [{ required: true, trigger: "blur", message: "请填写描述" }],

            },
            categories: []
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

        this.getCodeCategories();
    },
    methods: {
        async getCodeSnippets (page = 1, limit = 20) {
            try {
                const { rows } = await API.getCodeSnippets(page, limit)
                this.list = this.formatData(rows)
            } catch (error) {
                console.error(error)
            }
        },
        async getCodeCategories () {
            try {
                const { rows } = await API.getCodeCategories()
                this.categories = rows
            } catch (error) {
                console.error(error)
            }
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
            console.log(row)
            this.content = row.content
            this.form = this.note = row;
        },
        addImg(file){
            console.log(file)
        },
        save: _.debounce(function (html) {
            if(!html.trim()) {
                this.$message.warning("文章内容不能为空")
                return
            }
            try{
                localStorage.setItem("lastest-note", html)
                this.$message.success("草稿保存成功")
            }catch{
                this.$message.error("草稿保存失败")
            }
        }, 1000),
        async publish () {
            if(!this.note){
                return
            }
            const request = this.note._id ? API.updateCodeSnippet : API.addCodeSnippet;
            try {
                await request({
                    ...this.note,
                    category: this.note.category._id,
                    content: this.content
                });
            } catch (error) {
                console.error(error)
            }
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