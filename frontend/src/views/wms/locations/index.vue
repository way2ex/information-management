<template>
<div class="locations">
<el-row justify="start" type="flex">
  <el-button @click="createLine">新建通道</el-button>
  <!-- <el-button @click="deleteSelection">删除</el-button> -->
</el-row>
<el-form inline :model="queryForm" class="query-form" size="small">
  <el-row justify="start" type="flex">
    <el-col :span="6">
      <el-form-item label="货位编号">
        <el-input v-model="queryForm.uniqueCode"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item label="通道编号">
        <el-input v-model="queryForm.line"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item label="货架编号">
        <el-input v-model="queryForm.shelf"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="6" class="tal">
      <el-button size="small" type="primary" @click="getLocations(queryForm)">查询</el-button>
    </el-col>
  </el-row>
</el-form>
<el-table :data="tableData" border size="medium" class="table">
  <el-table-column type="selection" width="30"></el-table-column>
  <el-table-column prop="uniqueCode" label="货位编号" width="100"></el-table-column>
  <el-table-column prop="goodsName" label="位置详情" align="center" header-align="center">
    <template slot-scope="{ row: { line, shelf, col, layer } }">
      {{line}}通道 {{shelf}}货架 {{col}}列 {{layer}}层
    </template>
  </el-table-column>
  <el-table-column prop="line" label="通道" width="80"></el-table-column>
  <el-table-column prop="shelf" label="货架" width="80"></el-table-column>
  <el-table-column prop="col" label="列" width="80"></el-table-column>
  <el-table-column prop="layer" label="层" width="80"></el-table-column>
  <el-table-column prop="stateText" label="状态" width="80"></el-table-column>
  <el-table-column prop="goodsName" label="存储商品"></el-table-column>
  <!-- <el-table-column prop="goodsUniqueCode" label="商品编号"></el-table-column> -->
  <el-table-column prop="amount" label="商品数量" width="100"></el-table-column>
  <el-table-column label="操作" width="70">
    <template slot-scope="scope">
      <el-button size="small" @click.native.prevent="updateRow(scope.row)">修改</el-button>
    </template>
  </el-table-column>
</el-table>
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
  :current-page="1" :page-sizes="pageInformation.pageSizes"
  :page-size="pageInformation.pageSize" :total="pageInformation.total"></el-pagination>
</div>
</template>

<script>
export default {
  data () {
    return {
      queryForm: {
        uniqueCode: '',
        line: '',
        shelf: ''
      },
      pageInformation: {
        pageSizes: [20, 50, 100],
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      createFormData: {
        goodsName: '',
        extra: ''
      }
    };
  },
  created () {
    this.getLocations();
  },
  methods: {
    async getLocations () {
      let condition = { ...this.queryForm };
      condition.currentPage = this.pageInformation.currentPage;
      condition.pageSize = this.pageInformation.pageSize;
      let data = await ajax.get('/wms/locations', { params: condition });
      this.tableData = data.data;
      this.pageInformation = { ...this.pageInformation, total: data.total };
    },
    handleSizeChange (size) {
      this.pageInformation = { ...this.pageInformation, pageSize: size };
      this.getLocations();
    },
    handleCurrentChange (cur) {
      this.pageInformation = { ...this.pageInformation, currentPage: cur };
      this.getLocations();
    },
    createLine () {
      this.$prompt('请输入新建立的通道编号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async ({ value }) => {
        await ajax.post('/wms/create-line/', {
          line: value
        });
        this.$message({
          type: 'success',
          message: '新建成功'
        });
        this.getLocations();
      });
    },
    deleteSelection () {}
  }
};
</script>
<style lang="less" scoped>
.query-form {
  margin-top: 20px;
}
</style>
<style lang="less">
  .create-form {
    .el-form-item {
      width: 75%;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
