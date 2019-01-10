<template>
<div class="transship-execution">
  <el-form inline :model="queryForm" class="query-form" size="small" label-width="70px">
    <el-row justify="start" type="flex">
      <el-col :span="6">
        <el-form-item label="调拨编号">
          <el-input v-model="queryForm.uniqueCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="商品编号">
          <el-input v-model="queryForm.goodsUniqueCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="商品名称">
          <el-input v-model="queryForm.goodsName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="调拨员">
          <el-input v-model="queryForm.executor"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start">
      <el-col :span="6">
        <el-form-item label="当前状态" label-position="right">
          <el-select v-model="queryForm.state" width="188px">
            <el-option label="所有" value="1,2,3"></el-option>
            <el-option label="正在处理" :value="2"></el-option>
            <el-option label="已完成" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" class="tal">
        <el-form-item>
          <template slot="label">
            <el-button size="small" type="primary" @click="getData(queryForm)">查询</el-button>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start">
    </el-row>
  </el-form>
  <el-table :data="tableData" border size="medium" class="table" style="margin-top: 20px;">
    <el-table-column type="selection" width="30"></el-table-column>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-table border size="mini" :data="props.row.details">
          <el-table-column prop="amount" label="调拨数量" width="80"></el-table-column>
          <el-table-column label="调出货位">
            <template slot-scope="scope">
              {{scope.row.outLine}}通道 {{scope.row.outShelf}}货架 {{scope.row.outCol}}列 {{scope.row.outLayer}}层
            </template>
          </el-table-column>
          <el-table-column label="调入货位">
            <template slot-scope="scope">
              {{scope.row.inLine}}通道 {{scope.row.inShelf}}货架 {{scope.row.inCol}}列 {{scope.row.inLayer}}层
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column prop="uniqueCode" label="调拨单号"></el-table-column>
    <el-table-column prop="goodsUniqueCode" label="商品编号"></el-table-column>
    <el-table-column prop="goodsName" label="商品名称"></el-table-column>
    <el-table-column prop="transshipAmount" label="调拨数量" width="80px"></el-table-column>
    <el-table-column prop="executor" label="调拨员" width="80px"></el-table-column>
    <el-table-column prop="executingDate" label="开始时间" width="100px"></el-table-column>
    <el-table-column label="当前状态">
      <template slot-scope="scope">
        {{scope.row.stateText}} <br/>
        <div v-if="scope.row.state === -1">{{scope.row.checkExtra}}</div>
      </template>
    </el-table-column>
    <el-table-column prop="extra" label="备注"></el-table-column>
    <el-table-column label="操作" width="90">
      <template slot-scope="scope">
        <el-button size="mini"
          @click.native.prevent="execute(scope.row)"
          type="primary" :disabled="scope.row.state !== 1" v-if="scope.row.state === 1">开始处理</el-button>
        <el-button size="mini"
          @click.native.prevent="finish(scope.row)"
          type="primary" :disabled="scope.row.state === 3" v-if="scope.row.state === 2 || scope.row.state === 3">处理完成</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :current-page="1" :page-sizes="pageInformation.pageSizes" :page-size="pageInformation.pageSize" layout="total, sizes, prev, pager, next, jumper"
    :total="pageInformation.total"></el-pagination>

  <el-dialog title="确认提示" :visible="isExecuteDlgShow" center width="50%">
    <el-row justify="start" type="flex" class="mv10">当前处理的申请的信息如下，请确认是否进行处理：</el-row>
    <el-table border size="mini" :data="executingItem.details">
      <el-table-column prop="amount" label="调拨数量" width="80"></el-table-column>
      <el-table-column label="调出货位">
        <template slot-scope="scope">
          {{scope.row.outLine}}通道 {{scope.row.outShelf}}货架 {{scope.row.outCol}}列 {{scope.row.outLayer}}层
        </template>
      </el-table-column>
      <el-table-column label="调入货位">
        <template slot-scope="scope">
          {{scope.row.inLine}}通道 {{scope.row.inShelf}}货架 {{scope.row.inCol}}列 {{scope.row.inLayer}}层
        </template>
      </el-table-column>
    </el-table>
    <el-row slot="footer">
      <el-button size="media" @click="cancelExecute">取消</el-button>
      <el-button type="primary" size="media" @click="confirmExecute">确认</el-button>
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
        goodsUniqueCode: '',
        goodsName: '',
        executor: '',
        state: '1,2,3'
      },
      pageInformation: {
        pageSizes: [20, 50, 100],
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      isExecuteDlgShow: false,
      executingItem: { details: [] }
    };
  },
  created () {
    this.getData(this.queryForm);
  },
  methods: {
    handleSizeChange (size) {
      this.pageInformation = { ...this.pageInformation, pageSize: size };
      this.getData();
    },
    handleCurrentChange (cur) {
      this.pageInformation = { ...this.pageInformation, currentPage: cur };
      this.getData();
    },
    async getData (condition) {
      condition = condition ? { ...condition } : { ...this.queryForm };
      condition.currentPage = this.pageInformation.currentPage;
      condition.pageSize = this.pageInformation.pageSize;
      ajax
        .get('/wms/transship', {
          params: condition
        })
        .then(data => {
          this.tableData = data.data;
          this.pageInformation = { ...this.pageInformation, total: data.total };
        });
    },

    deleteSelection () {},
    execute (row) {
      this.isExecuteDlgShow = true;
      this.executingItem = row;
    },
    cancelExecute () {
      this.executingItem = { details: [], uniqueCode: '' };
      this.isExecuteDlgShow = false;
    },
    async confirmExecute () {
      let username = sessionStorage.getItem('username');
      await ajax.post('/wms/execute-transship', {
        username, uniqueCode: this.executingItem.uniqueCode
      });
      this.$message({
        message: '更改状态成功'
      });
      this.executingItem = { details: [], uniqueCode: '' };
      this.isExecuteDlgShow = false;
      this.getData(this.queryForm);
    },
    finish (row) {
      this.$confirm(
        '该操作将更改调拨申请为<strong>完成状态</strong>，确认要执行该操作吗？',
        'HTML 片段', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(async () => {
        await ajax.post('/wms/finish-transship', {
          username: sessionStorage.getItem('username'),
          uniqueCode: row.uniqueCode
        });
        this.$message({
          message: '更改状态成功',
          type: 'success'
        });
        this.getData();
      }).catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
</style>
<style lang="less">
.transship-application {
  .query-form {
    margin: 15px 0 0;
  }
  .table .divider{
    margin: 0 15px;
  }
  .form .el-input {
    width: 85%;
  }
}
</style>
