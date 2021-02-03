<template>
  <div class="grid">
    <div>
      <el-row :gutter="10" style="padding: 5px 5px 5px 25px;height: 48px;">
        <el-col>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="appendToTree">添加</el-button>
          <el-button type="success" size="mini" icon="el-icon-edit-outline" @click="updateCategory">更新</el-button>
          <el-button type="danger" size="mini" icon="el-icon-remove" @click="removeCategories">删除</el-button>
        </el-col>
      </el-row>
      <el-tree
        ref="tree"
        :data="treeData"
        :props="treeOptions"
        node-key="_id"
        show-checkbox
        @node-click="nodeClickHandler"
      >
        <div class="custom-tree-node" slot-scope="{ data }">
          <template v-if="data.editable">
            <!-- 出发了点击事件,所以报错了 -->
            <input type="text" v-model="data.title" @blur="doCategoryAction(data, $event)" @click.prevent.stop>
          </template>
          <template v-else>
            <div class="flex-center-start">
              <input :id="data._id" type="file" :data-id="data._id" style="width: 0;height: 0;overflow: hidden;">
              <img :src="data.avatar" @click.stop="setCategoryAvatar(data)" height="20" width="20">
              <span class="category-title">{{ data.title }}</span>
            </div>
          </template>
        </div>
      </el-tree>
    </div>
    <div class="table-widget">
      <el-row class="table-widget-top">
        <el-col>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="addCodeSnippet">添加</el-button>
          <el-button type="danger" size="mini" icon="el-icon-remove" @click="removeCodeSnippets">删除</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border stripe highlight-current-row :row-class-name="rowClass" @selection-change="selectionChange" size="mini" height="100%">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="" label="编号" width="50">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="_id" width="200" label="_id"></el-table-column>
        <el-table-column prop="title" width="300" label="标题" show-overflow-tooltip></el-table-column>
        <el-table-column width="180" label="查看/喜欢/收藏">
          <template slot-scope="scope">
            {{ scope.row.viewed }}/{{ scope.row.liked }}/{{ scope.row.collected }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" width="160" label="发布日期">
          <template slot-scope="scope">
            {{ dayjs(scope.row.createdAt).format("YYYY-MM-DD hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" width="160" label="更新日期">
          <template slot-scope="scope">
            {{ dayjs(scope.row.updatedAt).format("YYYY-MM-DD hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="updateCodeSnippet(scope.row)" type="text" size="small">更新</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination size="mini" @current-change="currentPageChange" @size-change="currentSizeChange" background  :current-Page="page" :page-size="limit" :page-sizes="[5, 10, 20, 40, 60, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total" class="table-widget-bottom"></el-pagination>
    </div>
  </div>
</template>

<script>
  import API from "@/api/api";
  import QiniuMixin from '@/mixins/qiniu';
  import randomstring from 'randomstring';
  import dayjs from 'dayjs';
  import { HttpResponseCode } from '@/constants/constants';

  const ADD_ID_LENGTH = 8; // 添加的节点 _id 的长度

  export default {
    name: 'tree-table',
    mixins: [QiniuMixin],
    props: {
      treeData: Array,
      treeOptions: Object,
      tableColumns: {
        type: Array
      },
    },
    data(){
      return {
        selectedTreeNode: null, // 点击树节点后才会有值
        selectedCodeSnippet: null,
        tableData: [],
        page: 1,
        limit: 20,
        total: 0,
        multipleSelection: []
      }
    },
    created(){
      this.getCodeSnippets();
    },
    methods: {
      dayjs,
      rowClass({ row }){
        return row.disabled? "code-snippet-disabled" : "";
      },
      nodeClickHandler(data, node) {
        this.selectedTreeNode = node;
        this.getCodeSnippetsByCategory(data._id);
      },
      async getCodeSnippets () {
        try {
          const { code, message, data: { rows, count } } = await API.getCodeSnippets(this.page, this.limit);
          if (code === HttpResponseCode.OK) {
            this.tableData = rows;
            this.total = count;
          } else {
            this.$message.error(message);
          }
        } catch (error) {
          console.error(error)
        }
      },
      async getCodeSnippetsByCategory(_id) {
        try {
          const { code, message, data: { rows, count } } = await API.getCodeSnippetsByCategory({ _id, page: this.page, limit: this.limit });
          if (code === HttpResponseCode.OK) {
            this.tableData = rows;
            this.total = count;
          } else {
            this.$message.error(message);
          }
        } catch(error) {
          console.error(error);
        }
      },
      async deleteRow(a){
        console.log(a);
      },
      appendToTree(){
        const tree = this.$refs.tree;
        tree.append({
          _id: randomstring.generate({
            capitalization: 'lowercase',
            length: ADD_ID_LENGTH
          }),
          title: '',
          count: 0,
          editable: true,
        });
      },
      updateCategory () {
        const selectedTreeNode = this.$refs.tree.getCheckedNodes();
        if (selectedTreeNode.length !== 1) {
          this.$message.warning("必须选择一项")
        } else {
          selectedTreeNode.forEach(node => {
            node.editable = true;
          })
        }
      },
      removeCategories () {
        const selectedTreeNode = this.$refs.tree.getCheckedNodes();
        if(selectedTreeNode.length){
          const reqs = selectedTreeNode.map(category => {
            return API.removeCategory(category)
          })
          Promise.all(reqs).then(() => {
            selectedTreeNode.forEach(node => {
              this.$refs.tree.remove(node)
            })
          })
          .catch(console.error)
        }
      },
      async doCategoryAction(category, event) {
        let request = null;
        if (category._id.length === ADD_ID_LENGTH) {
          request = API.addCategory;
        } else {
          request = API.updateCategory;
        }
        try {
          const { code, message, data } = await request(category);

          if (code === HttpResponseCode.OK) {
            this.$message.success(message);
            this.$set(category, '_id', data._id);
            this.$set(category, 'title', event.target.value);
            this.$set(category, 'editable', false);
          } else {
            this.$message.error(message);
          }
        } catch(error) {
          console.error(error);
        }
      },
      async setCategoryAvatar (data) {
        const fileUploadDOM = document.getElementById(`${data._id}`);
        fileUploadDOM.addEventListener("change", async event => {
          const file = event.target.files[0];
          const avatar = await this.uploadToQiniu(file);
          this.$set(data, 'avatar', avatar);
          await API.updateCategory(data);
        }, false);
        fileUploadDOM.click()
      },
      currentPageChange(page){
        this.page = page;
        if(this.selectedTreeNode){
          this.getCodeSnippetsByCategory(this.selectedTreeNode.data._id);
        }else{
          this.getCodeSnippets();
        }
      },
      currentSizeChange(size){
        this.limit = size;
        if(this.selectedTreeNode){
          this.getCodeSnippetsByCategory(this.selectedTreeNode.data._id);
        }else{
          this.getCodeSnippets();
        }
      },
      addCodeSnippet () {
        this.selectedCodeSnippet = null;
        this.$router.push({
          name: 'form'
        })
      },
      removeCodeSnippets () {
        if(this.multipleSelection.length){
          const reqs = this.multipleSelection.map(_id => {
            return API.removeCodeSnippet(_id)
          })
          Promise.all(reqs).then(() => {
            if (this.selectedTreeNode) {
              this.getCodeSnippetsByCategory(this.selectedTreeNode.data._id);
            } else {
              this.getCodeSnippets();
            }
          })
          .catch(console.error)
        }
      },
      updateCodeSnippet(codesnippet){
        this.selectedCodeSnippet = codesnippet;
        this.$router.push({
          name: 'form',
          params: {
            _id: codesnippet._id
          }
        })
      },
      selectionChange (list) {
        this.multipleSelection = list.map(({ _id }) => _id);
      }
    }
  };
</script>

<style lang="scss" scoped>

.post-title__link{
  cursor: pointer;
  text-decoration: underline;
  color: blue;
  font-size: 13px;
}

.grid{
  height: 100%;
  display: grid;
  grid-template-columns: 360px calc(100% - 360px);
  grid-template-rows: 100%;
}

.table-widget{
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 48px 1fr 48px;
  overflow: hidden;
  &-top {
    padding: 5px;
  }
  &-content {
    overflow: auto;
  }
  &-bottom {
    padding: 10px;
  }
}

.post-form__wrapper{
  overflow-y: auto;
}

.custom-tree-node {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 13px;

  div:first-child {
    flex: 1;
  }

  .category-title {
    margin-left: 10px;
  }

  div:last-child {
    width: 60px;
    text-align: right;
    padding-right: 10px;
  }
}
</style>