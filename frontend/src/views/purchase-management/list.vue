<template>
  <div>
    <el-row justify="start" type="flex">
      <el-button @click="create">申请采购</el-button>
    </el-row>
    <el-form :model="queryForm" class="query-form" size="small" label-width="70px" label-position="right">
      <el-row justify="start" type="flex">
        <el-col :span="5">
          <el-form-item label="采购编号">
            <el-input v-model="queryForm.uniqueCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="采购员">
            <el-input v-model="queryForm.purchaser"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" label-width="70px" label-position="right">
          <el-form-item label="状态">
            <el-select v-model="queryForm.state" width="188px">
              <el-option label="全部" value=""></el-option>
              <el-option label="未审核" value="0"></el-option>
              <el-option label="未签收" value="1"></el-option>
              <el-option label="部分签收" value="2"></el-option>
              <el-option label="全部签收" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="采购日期" label-width="80px">
            <el-input v-model="queryForm.purchasingDate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1" class="tal" label-width="70px" label-position="right">
          <el-button type="primary" @click="getPurchase(queryForm)" size="small">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="tableData" border
      class="table">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.goodsList" border>
            <el-table-column label="商品名称" prop="goodsName"></el-table-column>
            <el-table-column label="单价" prop="price"></el-table-column>
            <el-table-column label="数量" prop="amount"></el-table-column>
            <el-table-column label="总价" prop="totalPrice"></el-table-column>
            <el-table-column label="供应商" prop="provider"></el-table-column>
            <el-table-column label="状态" prop="stateText"></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button :disabled="scope.row.state !== 1" size="mini" type="text">签收</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="uniqueCode" label="采购编号"></el-table-column>
      <!-- <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="packingSpec">
        <slot name="label">包装规格<br>(cm3)</slot>
      </el-table-column>
      <el-table-column prop="amount" label="数量(台)" width="50"></el-table-column>
      <el-table-column prop="price" label="单价(元)" width="70"></el-table-column>
      <el-table-column prop="provider" label="供应商"></el-table-column> -->
      <el-table-column prop="purchaser" label="采购员"></el-table-column>
      <el-table-column prop="purchasingDate" label="采购日期"></el-table-column>
      <el-table-column prop="stateText" label="当前状态"></el-table-column>
      <el-table-column prop="extra" label="备注"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.state !== 0"
            @click.native.prevent="check(scope.$index, tableData)"
            type="text"
            size="small">
            审核
          </el-button>
          <el-button
            :disabled="scope.row.state !== 1"
            @click.native.prevent="sign(scope.$index, tableData)"
            type="text"
            size="small">签收全部
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
        uniqueCode: '',
        goodsName: '',
        provider: '',
        purchaser: '',
        purchasingDate: '',
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
    this.getPurchase();
  },
  methods: {
    getPurchase (condition) {
      condition = condition ? { ...condition } : {};
      condition.currentPage = this.pageInformation.currentPage;
      condition.pageSize = this.pageInformation.pageSize;
      ajax
        .get('/purchase', {
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
      this.$router.push({ name: 'purchase-create' });
    },
    selectionChange (selection) {
      this.deleteItems = selection.map(v => v._id);
    },
    async check (index, rows) {
      await ajax.post('/purchase/check', {
        uniqueCode: rows[index].uniqueCode
      });
      this.$message({
        type: 'success',
        message: '审核成功'
      });
      this.getPurchase();
    },
    async sign (index, rows) {
      await ajax.post('/purchase/sign', {
        uniqueCode: rows[index].uniqueCode
      });
      this.$message({
        type: 'success',
        message: '签收成功'
      });
      this.getPurchase();
    }
  }
};
</script>
<style lang="less" scoped>
.query-form {
  margin-top: 20px;
}
</style>
