<template>
  <div>
    <el-row justify="start" type="flex">
      <!-- <el-button @click="create">新建</el-button>
      <el-button @click="deleteSelection">删除</el-button> -->
    </el-row>
    <el-form inline :model="queryForm" class="query-form" size="small" label-width="70px" label-position="right">
      <el-row justify="start" type="flex">
        <el-col :span="6">
          <el-form-item label="编号">
            <el-input v-model="queryForm.uniqueCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请人">
            <el-input v-model="queryForm.applicant"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" label-width="70px" label-position="right">
          <el-form-item label="状态">
            <el-select v-model="queryForm.state" width="188px">
              <el-option label="未处理" value="0"></el-option>
              <el-option label="已入库" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="tal" label-width="70px" label-position="right">
          <el-form-item>
            <el-button type="primary" @click="getData(queryForm)">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="start" type="flex">

      </el-row>
    </el-form>
    <el-table
      :data="tableData" border
      class="table" size="media">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table v-if="props.row.state === 0" :data="props.row.goodsList" border size="small">
            <el-table-column label="商品名称" prop="goodsName"></el-table-column>
            <el-table-column label="商品编号" prop="uniqueCode"></el-table-column>
            <el-table-column label="数量" prop="amount"></el-table-column>
          </el-table>
          <el-table v-else :data="props.row.goodsList" border size="small">
            <el-table-column label="商品名称" prop="goodsName"></el-table-column>
            <el-table-column label="商品编号" prop="uniqueCode"></el-table-column>
            <el-table-column label="数量" prop="amount"></el-table-column>
            <el-table-column label="起始位置">
              <template slot-scope="scope">
                {{scope.row.startLine}}通道 {{scope.row.startShelf}}货架 {{scope.row.startCol}}列 {{scope.row.startLayer}}层
              </template>
              <!-- <el-table-column label="通道编号" prop="startLine"></el-table-column>
              <el-table-column label="货架编号" prop="startShelf"></el-table-column>
              <el-table-column label="列数" prop="startCol"></el-table-column>
              <el-table-column label="层数" prop="startLayer"></el-table-column> -->
            </el-table-column>
            <el-table-column label="结束位置">
              <template slot-scope="scope">
                {{scope.row.endLine}}通道 {{scope.row.endShelf}}货架 {{scope.row.endCol}}列 {{scope.row.endLayer}}层
              </template>
              <!-- <el-table-column label="通道编号" prop="endLine"></el-table-column>
              <el-table-column label="货架编号" prop="endShelf"></el-table-column>
              <el-table-column label="列数" prop="endCol"></el-table-column>
              <el-table-column label="层数" prop="endLayer"></el-table-column> -->
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="applicant" label="申请人"></el-table-column>
      <el-table-column prop="applicatingDate" label="申请日期"></el-table-column>
      <el-table-column prop="processor" label="处理人"></el-table-column>
      <el-table-column prop="stateText" label="状态"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="70">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="stockIn(scope.row)"
            type="text"
            size="small"
            :disabled="scope.row.state === 1">
            入库
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="1" :page-sizes="pageInformation.pageSizes"
      :page-size="pageInformation.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="pageInformation.total"></el-pagination>
    <el-dialog title="商品入库" :visible="isStockInDlgShow" center width="70%">
      <el-form label-width="80px" size="mini" :model="stockInForm" ref="stockInForm">
        <el-card v-for="(goods, index) in selectedRow.goodsList" :key="goods.id" class="stock-in-card">
          <el-row slot="header">
            <el-col :span="8">商品名称: {{goods.goodsName}}</el-col>
            <el-col :span="8">商品数量: {{goods.amount}}</el-col>
          </el-row>
          <el-col :span="3">起始位置：</el-col>
          <el-col :span="21">
            <el-col :span="6"><el-form-item label="通道编号" :rules="stockInRules" :prop="`goodsList.${index}.startLine`"><el-input v-model.number="stockInForm.goodsList[index].startLine" ></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="货架编号" :rules="stockInRules" :prop="`goodsList.${index}.startShelf`"><el-input v-model.number="stockInForm.goodsList[index].startShelf"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="列数" :rules="stockInRules" :prop="`goodsList.${index}.startCol`"><el-input v-model.number="stockInForm.goodsList[index].startCol"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="层数" :rules="stockInRules" :prop="`goodsList.${index}.startLayer`"><el-input v-model.number="stockInForm.goodsList[index].startLayer"></el-input></el-form-item></el-col>
          </el-col>
          <el-col :span="3">结束位置：</el-col>
          <el-col :span="21">
            <el-col :span="6"><el-form-item label="通道编号" :rules="stockInRules" :prop="`goodsList.${index}.endLine`"><el-input v-model.number="stockInForm.goodsList[index].endLine"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="货架编号" :rules="stockInRules" :prop="`goodsList.${index}.endShelf`"><el-input v-model.number="stockInForm.goodsList[index].endShelf"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="列数" :rules="stockInRules" :prop="`goodsList.${index}.endCol`"><el-input v-model.number="stockInForm.goodsList[index].endCol"></el-input></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="层数" :rules="stockInRules" :prop="`goodsList.${index}.endLayer`"><el-input v-model.number="stockInForm.goodsList[index].endLayer"></el-input></el-form-item></el-col>
          </el-col>
        </el-card>
      </el-form>
      <el-row slot="footer">
        <el-button size="media" @click="cancelStockIn">取消</el-button>
        <el-button type="primary" size="media" @click="confirmStockIn">确认</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: [],
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
      },
      isStockInDlgShow: false,
      selectedRow: {
        goodsList: []
      },
      stockInForm: {
        goodsList: []
      },
      stockInRules: [
        { required: true, message: '请输入位置信息', trigger: 'blur' },
        { type: 'number', message: '位置信息需要为数值', trigger: 'blur' }
      ]
    };
  },
  created () {
    this.getData();
    this.username = sessionStorage.getItem('username');
  },
  methods: {
    getData (condition) {
      condition = condition ? { ...condition } : {};
      condition.currentPage = this.pageInformation.currentPage;
      condition.pageSize = this.pageInformation.pageSize;
      ajax
        .get('/wms/stock-in-req', {
          params: condition
        })
        .then(data => {
          this.tableData = data.data;
          this.pageInformation = { ...this.pageInformation, total: data.total };
        });
    },
    handleSizeChange (size) {
      this.pageInformation = { ...this.pageInformation, pageSize: size };
      this.getData();
    },
    handleCurrentChange (cur) {
      this.pageInformation = { ...this.pageInformation, currentPage: cur };
      this.getData();
    },
    async stockIn (row) {
      this.selectedRow = row;
      let length = row.goodsList.length;
      this.stockInForm.goodsList = [];
      for (let i = 0; i < length; i++) {
        this.stockInForm.goodsList.push({
          ...row.goodsList[i], startLine: 1, startShelf: 1, startCol: 1, startLayer: 1, endLine: 1, endShelf: 1, endCol: 1, endLayer: 1
        });
      }
      this.isStockInDlgShow = true;
    },
    cancelStockIn () {
      this.isStockInDlgShow = false;
    },
    confirmStockIn () {
      this.$refs['stockInForm'].validate(async (valid) => {
        if (valid) {
          let data = { ...this.selectedRow, goodsList: this.stockInForm.goodsList, username: this.username };
          await ajax.post('/wms/stock-in', data);
          this.$message({
            type: 'success',
            message: '入库成功！'
          });
          this.$refs['stockInForm'].resetFields('');
          this.isStockInDlgShow = false;
          this.getData();
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
.stock-in-card .el-form-item__content {
  width: calc(100% - 80px);
}
</style>
