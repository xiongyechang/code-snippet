<template>
  <div class="markdown" v-html="compiledMarkdown" v-highlight></div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';
import { parse } from 'flowchart.js';
import xss from "xss";
export default {
  name: "html-markdown",
  props: {
    markdown: String
  },
  computed: {
    compiledMarkdown () {
      return marked(this.markdown);
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
          return hljs.highlight(lang, code, true).value;
        } else {
          return hljs.highlightAuto(code).value;
        }
      }
    });

    this.$loadStyle('./css/prism.css', () => {});
    this.$loadStyle('./css/monokai-sublime.css', () => {});
    this.$loadScript('./js/prism.js', () => {});
  },
}
</script>

<style lang="scss">
.markdown {
  word-break: break-all;
  line-height: 2rem;
  font-size: 18px;
  font-family: "Fira Code Retina";

  hr {
    margin: 10px 0;
  }

  h1,h2,h3,h4,h5,h6{
    padding: 10px 0;
  }

  img {
    max-width: 100%;
  }

  pre>code {
    border-radius: 5px;
  }
}
</style>