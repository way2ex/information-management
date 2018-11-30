<template>
  <div>
    <el-row justify="start" type="flex">
      <el-button @click="create">申请采购</el-button>
      <!-- <el-button @click="deleteSelection">删除</el-button> -->
    </el-row>
    <el-form inline :model="queryForm" class="query-form" size="small" label-width="70px" label-position="right">
      <el-row justify="start" type="flex">
        <el-col :span="6">
          <el-form-item label="采购编号">
            <el-input v-model="queryForm.uniqueCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品名称">
            <el-input v-model="queryForm.goodsName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商">
            <el-input v-model="queryForm.provider"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购员">
            <el-input v-model="queryForm.purser"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购日期">
            <el-input v-model="queryForm.purser"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="start" type="flex">
        <el-col :span="6" label-width="70px" label-position="right">
          <el-form-item label="状态">
            <el-select v-model="queryForm.state" width="188px">
              <el-option label="未审核" value="0"></el-option>
              <el-option label="未签收" value="1"></el-option>
              <el-option label="已签收" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="tal" label-width="70px" label-position="right">
          <el-form-item>
            <el-button type="primary" @click="getPurchase(queryForm)">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="tableData" border @selection-change="selectionChange"
      class="table">
      <el-table-column
        type="selection"
        width="50">
      </el-table-column>
      <el-table-column prop="uniqueCode" label="采购编号"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="packingSpec" label="包装规格"></el-table-column>
      <el-table-column prop="amount" label="数量"></el-table-column>
      <el-table-column prop="price" label="单价"></el-table-column>
      <el-table-column prop="provider" label="供应商"></el-table-column>
      <el-table-column prop="purchaser" label="采购员"></el-table-column>
      <el-table-column prop="purchasingDate" label="采购日期"></el-table-column>
      <el-table-column prop="state" label="当前状态"></el-table-column>
      <el-table-column prop="extra" label="备注"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="70">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="updateRow(scope.$index, tableData)"
            type="text"
            size="small">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="1" :page-sizes="pageInformation.pageSizes" :page-size="pageInformation.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="pageInformation.total"></el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      queryForm: {
        nickname: '',
        username: '',
        department: '',
        position: '',
        state: ''
      },
      pageInformation: {
        pageSizes: [20, 50, 100],
        currentPage: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  created () {
    // this.getPurchase();
  },
  methods: {
    getPurchase (condition) {
      condition = condition ? { ...condition } : {};
      condition.currentPage = this.pageInformation.currentPage;
      condition.pageSize = this.pageInformation.pageSize;
      ajax
        .get("/user", {
          params: condition
        })
        .then(data => {
          this.tableData = data.data;
          this.pageInformation = { ...this.pageInformation, total: data.total };
        });
    },
    handleSizeChange (size) {
      this.pageInformation = { ...this.pageInformation, pageSize: size };
      this.getPurchase();
    },
    handleCurrentChange (cur) {
      this.pageInformation = { ...this.pageInformation, currentPage: cur };
      this.getPurchase();
    },
    create () {
      this.$router.push({ name: 'um-create' });
    },
    selectionChange (selection) {
      this.deleteItems = selection.map(v => v._id);
    },
    async deleteSelection() {
      if (!this.deleteItems.length) {
        this.$message({
          type: 'error',
          message: '请选择要删除的项目'
        });
        return;
      }
      let data = await ajax.post('/user/delete', {
        items: this.deleteItems
      });
      this.$message({
        message: '删除成功',
        type: 'success'
      });
      this.getPurchase();
    },
    async updateRow(index, rows) {
      this.$router.push({ name: 'um-update', params: { id: rows[index].username } });
    }
  }
};
</script>
<style lang="less" scoped>
.query-form {
  margin-top: 20px;
}
</style>
