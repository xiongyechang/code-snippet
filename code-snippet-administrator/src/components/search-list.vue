<template>
  <div class="search-list full-height">
    <div class="search-input pad5">
      <el-input
        v-model="keyword"
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        @change="seachCodeSnippets">
        <el-select v-model="category" @change="seachCodeSnippets" slot="prepend" placeholder="请选择">
          <el-option v-for="item of options" :key="item._id" :label="item.title" :value="item._id">
            <code-category :data="item"></code-category>
          </el-option>
        </el-select>
        <template slot="append">
          <el-button icon="el-icon-search" circle>搜索</el-button>
        </template>
      </el-input>
    </div>
    <ul class="list-outter">
      <li class="list-item" :class="{
        current: c === currentListItem
      }" v-for="(c, index) of list" :key="index" @click="rowClick(c)">
        <el-avatar shape="square" size="small" :src="c.category.avatar"></el-avatar>
        <div class="title">{{ c.title }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import API from '@/api/api';
import { HttpResponseCode } from '@/constants/constants';
import CodeCategory from '@/components/code-category.vue'
export default {
  name: "search-list",
  components : { CodeCategory },
  data(){
    return {
      keyword: "",
      list: [],
      count: 0,
      page: 1,
      limit: 20,
      category: "",
      options: [],
      currentListItem: null
    }
  },
  created () {
    this.getCodeSnippets();
    this.getCodeCategories();
  },
  methods: {
    async getCodeSnippets () {
      try {
        const { code, message, data: { rows, count } } = await API.getCodeSnippets(this.page, this.limit);
        if (code === HttpResponseCode.OK) {
          this.list = rows;
          this.count = count;
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
          this.options = rows.reduce(function(prev, curr) {
            return prev.concat(curr)
          }, [{
            _id: null,
            title: "全部",
            avatar: "https://cdn.xiongyechang.com/all.png"
          }]);
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        console.error(error)
      }
    },
    rowClick(row){
      this.currentListItem = row;
      this.$emit("row-click", row);
    },
    async seachCodeSnippets () {
      this.page = 1;

      if (this.category === null) {
        this.getCodeSnippets();
        return;
      }

      try {
        const { code, message, data: { rows, count } } = await API.searchCodeSnippets(this.keyword, this.category, this.page, this.limit);
        if (code === HttpResponseCode.OK) {
          this.list = rows;
          this.count = count;
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.selected {
  background-color: rgba(49, 193, 124, 1) !important;
  font-weight: bold;
  color: #FFFFFF;
}

.search-list {
  background-color: rgb(236, 239, 241);
  display: flex;
  flex-direction: column;
}

.search-input {
  height: 28px;
}

.list-outter {
  overflow: auto;
  height: calc(100% - 38px);
}

.list-item {
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  margin: 5px;
  border-radius: 5px 0 5px 0;
}

.current, .list-item:hover {
  @extend .selected;
}

.list-item:nth-child(odd) {
  background-color: rgb(192, 196, 204);
}

.list-item:nth-child(even) {
  background-color: rgb(192, 196, 204);
}

.title {
  margin-left: 10px;
}

li {
  list-style: none;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
</style>