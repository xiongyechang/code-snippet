<template>
    <div class="admin-page">
        <!-- <el-row class="row row1">
            <el-col :span="24" align="right">
                <el-button type="primary" icon="el-icon-s-promotion" @click="publish">发布</el-button>
                <el-button type="danger" icon="el-icon-download" @click="saveMarkdown">保存</el-button>
            </el-col>
        </el-row> -->

        <el-row class="row row2">
            <el-col class="row2-col1" :span="18">
                <mavon-editor id="editor" v-model="form.content" @imgAdd="addImg" @save="save"/>
            </el-col>
            <el-col :span="6" style="padding: 0;">
                <div class="opt">
                    <el-button type="primary" icon="el-icon-s-promotion" @click="publish">发布</el-button>
                </div>
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="标题" prop="title" required>
                        <el-input type="text" v-model="form.title" required></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="summary" required>
                        <el-input type="textarea" rows="10" v-model="form.summary" required></el-input>
                    </el-form-item>
                    <el-form-item label="禁用" prop="disabled" required>
                        <el-select filterable v-model="form.disabled" style="width: 100%;" placeholder="是否禁用">
                            <el-option v-for="item of disabledList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类" prop="category" required>
                        <el-select filterable v-model="form.category" style="width: 100%;" placeholder="请选择分类">
                            <el-option v-for="item of categories" :key="item._id" :label="item.title" :value="item._id">
                                <code-category :data="item"></code-category>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上一篇" prop="prev">
                        <el-select filterable v-model="form.prev" style="width: 100%;" placeholder="请选择上一篇">
                            <el-option v-for="item of list" :key="item._id" :label="item.title" :value="item._id">
                                <code-category :data="item"></code-category>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="下一篇" prop="next">
                        <el-select filterable v-model="form.next" style="width: 100%;" placeholder="请选择下一篇">
                            <el-option v-for="item of list" :key="item._id" :label="item.title" :value="item._id">
                                <code-category :data="item"></code-category>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关联" prop="relations">
                        <el-select filterable multiple v-model="form.relations" style="width: 100%;" placeholder="请选择相关项">
                            <el-option v-for="item of list" :key="item._id" :label="item.title" :value="item._id">
                                <code-category :data="item"></code-category>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import API from '@/api/api'
import CodeCategory from '@/components/code-category.vue'
import marked from 'marked'
import _ from 'lodash'
import hljs from 'highlight.js'
import xss from 'xss'
import { parse } from 'flowchart.js'
import { shell } from 'electron'
import fs from 'fs'
  import { HttpResponseCode } from '@/constants/constants'

export default {
    name: "admin",
    components : { CodeCategory },
    props: {
        _id: String
    },
    data () {
        return {
            list:[],
            note: null,
            form: {
                title: '',
                summary: '',
                disabled: false,
                category: '',
                prev: '',
                next: '',
                relations: [],
                content: ''
            },
            rules: {
                title: [{ required: true, trigger: "blur", message: "请填写标题" }],
                summary: [{ required: true, trigger: "blur", message: "请填写描述" }],
                category: [{ required: true, trigger: "blur", message: "请选择分类" }],
                content: [{ required: true, trigger: "blur", message: "请输入内容" }]
            },
            categories: [],
            disabledList: [{
                label: "是",
                value: true
            }, {
                label: "否",
                value: false
            }]
        }
    },
    computed: {
        compiledMarkdown () {
            return marked(this.form.content)
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

        if(this._id){
            this.getCodeSnippet(this._id);
        }

        this.getCodeSnippets();

        this.getCodeCategories();
    },
    methods: {
        async getCodeSnippet (_id) {
            try {
                const { code, message, data } = await API.getCodeSnippet(_id);
                if (code === HttpResponseCode.OK) {
                    this.form = data;
                } else {
                    this.$message.error(message);
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getCodeSnippets (page = 1, limit = 20) {
            try {
                const { code, message, data: { rows } } = await API.getCodeSnippets(page, limit)
                if (code === HttpResponseCode.OK) {
                    this.list = this.formatData(rows);
                } else {
                    this.$message.error(message);
                }
            } catch (error) {
                console.error(error)
            }
        },
        async getCodeCategories () {
            try {
                const { code, message, data: { rows } } = await API.getCodeCategories();
                if (code === HttpResponseCode.OK) {
                    this.categories = rows;
                } else {
                    this.$message.error(message);
                }
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
            this.form.content = e.target.value
        }, 300),
        markdownClicked (event) {
            event.preventDefault();
            const element = event.target;
            if(element && element.tagName.toLowerCase() === 'a'){
                shell.openExternal(element.href)
            }
        },
        saveMarkdown () {
            fs.writeFileSync("./markdown.md", this.form.content);
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
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    const request = this._id ? API.updateCodeSnippet : API.addCodeSnippet;
                    try {
                        const { code, message} = await request(this.form);
                        if (code === HttpResponseCode.OK) {
                            this.$message.success(message);
                        } else {
                            this.$message.error(message);
                        }
                    } catch (error) {
                        console.error(error)
                    }

                } else {
                    return false;
                }
            });
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
    padding: 10px;
    background: lightblue;
}

.row2 {
    height: calc(100% - 0px);
}

.row2-col1 {
    padding: 0 !important;
    margin: 0 !important;
    height: 100%;
}

.opt {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
    border-bottom: 1px solid #f2f6fc;
    padding: 1px 10px;
}

#editor {
    height: 100%;
}
</style>