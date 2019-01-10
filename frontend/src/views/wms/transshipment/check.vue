<template>
<div class="transship-check">
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
    </el-row>
    <el-row type="flex" justify="start">
      <el-col :span="6">
        <el-form-item label="当前状态" label-position="right">
          <el-select v-model="queryForm.state" width="188px">
            <el-option label="所有" value=""></el-option>
            <el-option label="未通过" :value="-1"></el-option>
            <el-option label="未审核" :value="0"></el-option>
            <el-option label="已通过" :value="1"></el-option>
            <el-option label="正在处理" :value="2"></el-option>
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
    <el-table-column prop="amount" label="可调拨数量" width="100px"></el-table-column>
    <el-table-column prop="transshipAmount" label="调拨数量" width="80px"></el-table-column>
    <el-table-column label="申请日期" width="100px">
      <template slot-scope="scope">
        {{scope.row.applicatingDate.split(' ')[0]}} <br/>
        {{scope.row.applicatingDate.split(' ')[1]}}
      </template>
    </el-table-column>
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
          @click.native.prevent="check(scope.row.uniqueCode)"
          type="primary" :disabled="scope.row.state !== 0">审核</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :current-page="1" :page-sizes="pageInformation.pageSizes" :page-size="pageInformation.pageSize" layout="total, sizes, prev, pager, next, jumper"
    :total="pageInformation.total"></el-pagination>

  <el-dialog title="调拨审核" :visible="isCheckDlgShow" center width="50%">
    <el-form :model="checkFormData" :rules="checkFormRules" ref="checkForm">
      <el-form-item prop="isApproved" label="审核结果">
        <el-radio v-model="checkFormData.isApproved" :label="true">审核通过</el-radio>
        <el-radio v-model="checkFormData.isApproved" :label="false">审核不通过</el-radio>
      </el-form-item>
      <el-form-item prop="extra" v-if="checkFormData.isApproved === false" label="拒绝理由">
        <el-input v-model="checkFormData.extra" type="textarea" :rows="3" ></el-input>
      </el-form-item>
    </el-form>
    <el-row slot="footer">
      <el-button size="media" @click="cancelCheck">取消</el-button>
      <el-button type="primary" size="media" @click="confirmCheck">确认</el-button>
    </el-row>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    let checkExtraRule = (rule, value, cb) => {
      if (this.checkFormData.isApproved === false && !value) {
        cb(new Error('请输入审核未通过的理由！'));
        return;
      }
      cb();
    };
    return {
      queryForm: {
        uniqueCode: '',
        goodsUniqueCode: '',
        goodsName: '',
        state: ''
      },
      pageInformation: {
        pageSizes: [20, 50, 100],
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      isCheckDlgShow: false,
      checkFormData: {
        uniqueCode: '',
        isApproved: '',
        extra: ''
      },
      checkFormRules: {
        isApproved: [
          { required: true, message: '请选择审核结果', trigger: 'blur' }
        ],
        extra: [
          { validator: checkExtraRule }
        ]
      }
    };
  },
  created () {
    this.getData();
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
      condition = condition ? { ...condition } : {};
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
    check (uniqueCode) {
      this.isCheckDlgShow = true;
      this.checkFormData.uniqueCode = uniqueCode;
    },
    cancelCheck () {
      this.$refs['checkForm'].resetFields();
      this.isCheckDlgShow = false;
    },
    async confirmCheck () {
      this.$refs['checkForm'].validate(async (valid) => {
        if (valid) {
          let username = sessionStorage.getItem('username');
          await ajax.post('/wms/check-transship', {
            username, ...this.checkFormData
          });
          this.$message({
            message: '审核成功'
          });
          this.$refs['checkForm'].resetFields();
          this.isCheckDlgShow = false;
          this.getData();
        }
      });
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
