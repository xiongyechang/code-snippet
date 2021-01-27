<template>
    <el-row class="search-list__row">
      <el-col class="full-height pad10" :span="6">
        <search-list @row-click="rowClick"></search-list>
      </el-col>
      <el-col class="content full-height pad10" :span="18">
        <div v-html="compiledMarkdown"></div>
      </el-col>
    </el-row>
</template>

<script>
import SearchList from '@/components/search-list';
import marked from 'marked';
import hljs from 'highlight.js';
import { parse } from 'flowchart.js';
import xss from "xss";
export default {
  name: "web",
  components: { SearchList },
  data(){
    return {
      form: {
        content: ``
      }
    }
  },
  computed: {
    compiledMarkdown () {
      return marked(this.form.content);
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
  created() {
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
  },
  methods: {
    rowClick(row){
      console.log(row);
      this.form = row;
    }
  }
}
</script>

<style lang="css" scoped>
.search-list__row {
  height: 100%;
}
.content {
  overflow: auto;
  /* background-color: rgb(236, 239, 241); */
}
</style>