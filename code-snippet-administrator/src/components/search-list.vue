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
    <div class="list-outter">
      <ul class="list-inner">
        <li class="list-item" :class="{
          current: c === currentListItem
        }" v-for="(c, index) of list" :key="index" @click="rowClick(c)">
          <el-avatar shape="square" size="small" :src="c.category.avatar"></el-avatar>
          <div class="title">{{ c.title }}</div>
          <div class="list-index" :index="index">{{index+1}}</div>
        </li>
      </ul>
      <div v-if="noMore" class="no-more">没有更多数据了</div>
    </div>
  </div>
</template>

<script>
import API from '@/api/api';
import { HttpResponseCode } from '@/constants/constants';
import CodeCategory from '@/components/code-category.vue';

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
  computed: {
    noMore () {
      return this.list.length === this.count;
    }
  },
  methods: {
    handleScroll () {

      const outterDOM = document.querySelector('.list-outter');
      const innerDOM = document.querySelector('.list-inner');
     
      const outterDOMHeight = outterDOM.clientHeight;
      const innerDOMHeight = innerDOM.clientHeight;

      if (innerDOMHeight < outterDOMHeight) {
        return;
      }

      outterDOM.onscroll = () => {
        if (outterDOMHeight + outterDOM.scrollTop >= innerDOMHeight) {

          if (this.list.length === this.count) {
            return;
          }

          if (this.page < Math.ceil(this.count / this.limit)) {
            this.page++;
            this.getCodeSnippets();
          }
        }
      }
    },
    async getCodeSnippets () {
      try {
        const { code, message, data: { rows, count } } = await API.getCodeSnippets(this.page, this.limit);
        if (code === HttpResponseCode.OK) {
          this.count = count;
          if (this.page === 1) {
            this.list = rows;
          } else {
            this.list.push.apply(this.list, rows); // 超大数据量时，push方法不创建新的数组，可以降低内存
          }
          this.$nextTick(() => {
            this.handleScroll();
          });
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
          this.$nextTick(() => {
            this.handleScroll();
          });
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

.list-inner {
  margin: 0;
  padding: 0;
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
  position: relative;
}

.list-index {
  position: absolute;
  right: 0;
  height:100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  width: 50px;
  padding-right: 10px;
  font-size: 28px;
  transform: rotateZ(30deg);
  color: #e3e3e3;
  font-family: 'fira code retina';
  mix-blend-mode: lighten;
  z-index: 2;
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
  width: 0px;
  height: 0px;
}

.no-more {
  text-align: center;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  margin-bottom: 5px;
  color: #333333;
}
</style>