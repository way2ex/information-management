<template>
<div>
<el-row justify="start" type="flex">
  <el-button @click="create">新建</el-button>
  <el-button @click="deleteSelection">删除</el-button>
</el-row>
<el-form inline :model="queryForm" class="query-form" size="small">
  <el-row justify="start" type="flex">
    <el-col :span="6">
      <el-form-item label="商品编号">
        <el-input v-model="queryForm.uniqueCode"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item label="商品名称">
        <el-input v-model="queryForm.goodsName"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="6" class="tal">
      <el-button size="small" type="primary" @click="getGoods(queryForm)">查询</el-button>
    </el-col>
  </el-row>
</el-form>
<el-table :data="tableData" border size="medium" class="table">
  <el-table-column type="selection" width="30"></el-table-column>
  <el-table-column type="expand">
    <template slot-scope="props">
      <el-table border size="mini" :data="props.row.position" v-if="+props.row.amount !== 0">
        <el-table-column prop="amount" label="数量"></el-table-column>
        <el-table-column label="起始位置">
          <el-table-column label="通道编号" prop="startLine"></el-table-column>
          <el-table-column label="货架编号" prop="startShelf"></el-table-column>
          <el-table-column label="列数" prop="startCol"></el-table-column>
          <el-table-column label="层数" prop="startLayer"></el-table-column>
        </el-table-column>
        <el-table-column label="结束位置">
          <el-table-column label="通道编号" prop="endLine"></el-table-column>
          <el-table-column label="货架编号" prop="endShelf"></el-table-column>
          <el-table-column label="列数" prop="endCol"></el-table-column>
          <el-table-column label="层数" prop="endLayer"></el-table-column>
        </el-table-column>
      </el-table>
      <el-row v-else>暂无商品位置信息</el-row>
    </template>
  </el-table-column>
  <el-table-column prop="uniqueCode" label="商品编号"></el-table-column>
  <el-table-column prop="goodsName" label="商品名称"></el-table-column>
  <el-table-column prop="amount" label="总计数量"></el-table-column>
  <el-table-column prop="extra" label="备注"></el-table-column>
  <el-table-column label="操作" width="70">
    <template slot-scope="scope">
      <el-button size="small" @click.native.prevent="updateRow(scope.row)">修改</el-button>
    </template>
  </el-table-column>
</el-table>
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
  :current-page="1" :page-sizes="pageInformation.pageSizes"
  :page-size="pageInformation.pageSize" :total="pageInformation.total"></el-pagination>

<el-dialog title="新建商品" :visible="isCreateDlgShow" center width="40%">
  <el-form :model="createFormData" ref="createForm" :rules="createRules" label-width="80px" class="create-form">
    <el-row type="flex" justify="center">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="createFormData.goodsName"></el-input>
        </el-form-item>
    </el-row>
    <el-row type="flex" justify="center">
      <el-form-item label="备注" prop="extra">
        <el-input v-model="createFormData.extra" type="textarea"></el-input>
      </el-form-item>
    </el-row>
  </el-form>
  <el-row class="tac">
    <el-button @click="cancelCreate">取消</el-button>
    <el-button type="primary" @click="confirmCreate">确认</el-button>
  </el-row>
</el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      queryForm: {
        uniqueCode: '',
        goodsName: ''
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
      },
      isCreateDlgShow: false,
      createRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getGoods();
  },
  methods: {
    async getGoods (condition) {
      condition = condition ? { ...condition } : {};
      condition.currentPage = this.pageInformation.currentPage;
      condition.pageSize = this.pageInformation.pageSize;
      let data = await ajax.get('/wms/goods', { params: condition });
      this.tableData = data.data;
      this.pageInformation = { ...this.pageInformation, total: data.total };
    },
    handleSizeChange (size) {
      this.pageInformation = { ...this.pageInformation, pageSize: size };
      this.getGoods();
    },
    handleCurrentChange (cur) {
      this.pageInformation = { ...this.pageInformation, currentPage: cur };
      this.getGoods();
    },
    create () {
      this.isCreateDlgShow = true;
    },
    deleteSelection () {},
    cancelCreate () {
      this.$refs['createForm'].resetFields();
      this.isCreateDlgShow = false;
    },
    confirmCreate () {
      this.$refs['createForm'].validate(async (valid) => {
        if (valid) {
          await ajax.post('/wms/create-goods', this.createFormData);
          this.$message({
            type: 'success',
            message: '创建成功'
          });
          this.$refs['createForm'].resetFields();
          this.isCreateDlgShow = false;
          this.getGoods();
        }
      });
    }
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
