<template>
    <el-row class="search-list__row">
      <el-col class="full-height pad10" :span="6">
        <search-list @row-click="rowClick"></search-list>
      </el-col>
      <el-col class="content full-height pad10" :span="18">
        <HtmlMarkdown :markdown="markdown"></HtmlMarkdown>
      </el-col>
    </el-row>
</template>

<script>
import SearchList from '@/components/search-list';
import HtmlMarkdown from '@/components/html';

export default {
  name: "web",
  components: { SearchList, HtmlMarkdown },
  data(){
    return {
      markdown: ``
    }
  },
  methods: {
    rowClick(row){
      this.markdown = row.content;
    }
  }
}
</script>

<style lang="css" scoped>
.search-list__row {
  /*height: 100%;*/
}
.content {
  overflow: auto;
}
</style>