<template>
  <div class="search-list full-height">
    <div class="search-input pad5">
      <el-input v-model="keyword"></el-input>
    </div>
    <ul class="list-outter">
      <li class="list-item" v-for="(c, index) of list" :key="index" @click="rowClick(c)">
        <el-avatar shape="square" size="small" :src="c.category.avatar"></el-avatar>
        <div class="title">{{ c.title }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import API from '@/api/api';
import { HttpResponseCode } from '@/constants/constants';
export default {
  name: "search-list",
  data(){
    return {
      keyword: "",
      list: [],
      count: 0,
      page: 1,
      limit: 20
    }
  },
  created () {
    this.getCodeSnippets()
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
    rowClick(row){
      this.$emit("row-click", row);
    }
  }
}
</script>

<style scoped>
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
  margin-bottom: 5px;
  margin-left: 10px;
  border-radius: 3px 0 0 3px;
}

.list-item:hover {
  background: rgba(49, 193, 124, 1) !important;
  font-weight: bold;
  color: #FFFFFF;
}

.list-item:nth-child(odd) {
  background-color: rgba(192, 196, 204);
}

.list-item:nth-child(even) {
  background-color: rgba(192, 196, 204);
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