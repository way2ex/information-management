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
          <el-table v-else :data="props.row.goodsList" border size="small" :default-expand-all="true">
            <el-table-column type="expand">
              <template slot-scope="{ row }">
                <el-table :data="row.positions" size="mini">
                  <el-table-column label="位置">
                    <template slot-scope="{ row }">
                      {{row.line}}通道 {{row.shelf}}货架 {{row.col}}列 {{row.layer}}层
                    </template>
                  </el-table-column>
                  <el-table-column label="数量" prop="amount"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="goodsName"></el-table-column>
            <el-table-column label="商品编号" prop="uniqueCode"></el-table-column>
            <el-table-column label="数量" prop="amount"></el-table-column>
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
    <el-dialog title="商品入库" :visible="isStockInDlgShow" center width="60%">
      <el-form label-width="60px" size="mini" :model="stockInForm" ref="stockInForm">
        <el-card v-for="(goods, index) in stockInForm.goodsList" :key="goods.id" class="stock-in-card">
          <el-row slot="header">
            <el-col :span="8">商品名称: {{goods.goodsName}}</el-col>
            <el-col :span="8">商品数量: {{goods.amount}}</el-col>
          </el-row>
          <el-row type="flex" justify="start" class="mb15"
            v-for="(position, positionIndex) in stockInForm.goodsList[index].positions" :key="position.id">
            <el-col :span="4">
              <el-form-item label="通道" :rules="stockInRules" :prop="`goodsList.${index}.positions.${positionIndex}.line`">
                <el-select v-model="stockInForm.goodsList[index].positions[positionIndex].line">
                  <el-option v-for="line in lines" :key="line" :label="line" :value="line"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="货架" :rules="stockInRules" :prop="`goodsList.${index}.positions.${positionIndex}.shelf`">
                <el-select v-model="stockInForm.goodsList[index].positions[positionIndex].shelf">
                  <el-option v-for="shelf in shelves" :key="shelf" :label="shelf" :value="shelf"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="列" :rules="stockInRules" :prop="`goodsList.${index}.positions.${positionIndex}.col`">
                <el-select v-model="stockInForm.goodsList[index].positions[positionIndex].col">
                  <el-option v-for="col in cols" :key="col" :label="col" :value="col"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="层" :rules="stockInRules" :prop="`goodsList.${index}.positions.${positionIndex}.layer`">
                <el-select v-model="stockInForm.goodsList[index].positions[positionIndex].layer">
                  <el-option v-for="layer in layers" :key="layer" :label="layer" :value="layer"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="数量" :rules="stockInAmountRules" :prop="`goodsList.${index}.positions.${positionIndex}.amount`">
                <el-input v-model.number="stockInForm.goodsList[index].positions[positionIndex].amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="2">
              <el-button @click="deletePosition(index, positionIndex)" type="danger" size="mini">删除</el-button>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start">
            <el-button type="primary" size="mini" @click="addPosition(index)">添加位置</el-button>
          </el-row>
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
    let stockInAmountRules = (rule, value, cb) => {
      if (value === 0) {
        cb(new Error('数量不可为0'));
        return;
      }
      this.stockInForm.goodsList.forEach((goods) => {
        let total = goods.positions.reduce((acc, cur) => { return acc + +cur.amount; }, 0);
        if (total !== +goods.amount) {
          cb(new Error('请认真核对各位置数量'));
        } else {
          cb();
        }
      });
    };
    return {
      username: [],
      tableData: [],
      lines: [],
      shelves: ['A', 'B'],
      cols: ['1', '2', '3', '4', '5'],
      layers: ['1', '2', '3', '4'],
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
        { required: true, message: '请输入位置信息', trigger: 'blur' }
      ],
      stockInAmountRules: [
        { validator: stockInAmountRules, trigger: 'blur' }
      ]
    };
  },
  created () {
    this.getData();
    this.getLines();
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
    async getLines () {
      let response = await ajax.get('/wms/lines');
      this.lines = response;
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
      this.stockInForm.goodsList = row.goodsList.map((v) => ({
        ...v,
        positions: [{ id: 0, line: '1', shelf: 'A', col: '1', layer: '1', amount: 0 }]
      }));
      this.isStockInDlgShow = true;
    },
    cancelStockIn () {
      this.isStockInDlgShow = false;
    },
    confirmStockIn () {
      this.$refs['stockInForm'].validate(async (valid) => {
        if (valid) {
          this.stockInForm.goodsList.forEach((goods) => {
            goods.positions.forEach((position) => {
              position.uniqueCode = position.line + position.shelf + position.col + position.layer;
            });
          });
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
    },
    deletePosition (index, subIndex) {
      this.stockInForm.goodsList[index].positions.splice(subIndex, 1);
    },
    addPosition (index) {
      let positions = this.stockInForm.goodsList[index].positions;
      let obj = positions[positions.length - 1];
      positions.push({
        ...obj,
        id: obj.id + 1,
        amount: 0
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
  width: calc(100% - 60px);
}
</style>
