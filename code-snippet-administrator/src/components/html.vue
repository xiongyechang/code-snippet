<template>
  <div class="markdown" id="markdown" v-html="compiledMarkdown" v-highlight></div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';
import { parse } from 'flowchart.js';
import xss from "xss";
import { Button } from "@/constants/constants";
import { shell, remote } from 'electron';

const dialog = remote.dialog;

export default {
  name: "html-markdown",
  props: {
    markdown: String
  },
  computed: {
    compiledMarkdown () {
      return marked(this.markdown, { sanitize: false });
    }
  },
  directives: {
    highlight: function(el) {
      let blocks = el.querySelectorAll('pre code');
      blocks.forEach(block => {
        hljs.highlightBlock(block);
      });
      window.Prism.highlightAll();
    }
  },
  created() {
    var renderer = new marked.Renderer();

    renderer.code = (code, language) => {
      if (language === 'flow') {// 流程图
        const dom = document.createElement('div');
        const flowchart = parse(code);
        flowchart.drawSVG(dom);
        return dom.innerHTML
      } else if (language === 'seq' || language === 'gantt') {
        return hljs.highlightAuto(code).value
      } else if (language) {
        // 默认解析
        return `<pre class="language-${language}"><code class="hljs language-${language}">${hljs.highlight(language, code, true).value}</code></pre>`
      } else {
        return xss(hljs.highlightAuto(code).value);
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
      highlight: function (code, language) {
        if (language && hljs.getLanguage(language)) {
          return hljs.highlight(language, code, true).value;
        } else {
          return hljs.highlightAuto(code).value;
        }
      }
    });
  },
  mounted () {
    const markdown = document.querySelector(`#markdown`);
    markdown.addEventListener("click", event => {
      const element = event.target;
      if (element.tagName.toLowerCase() === 'a') {
        event.preventDefault();

        const result = dialog.showMessageBoxSync({
          title: '通知',
          type: 'question',
          message: `是否使用默认浏览器打开该链接`,
          buttons: [Button.Cancel, Button.OK]
        });

        if (result) {
          shell.openExternal(element.href);
        }

      }
    }, true);
  },
  methods: {
    htmlClickHndler (e) {
      console.log(e)
      e.stopDefault(); 
    }
  }
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