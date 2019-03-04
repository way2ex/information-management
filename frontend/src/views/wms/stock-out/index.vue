<template>
<div class="stockout-management">
  <el-row justify="start" type="flex">
    <el-button @click="create">新建出库单</el-button>
    <!-- <el-button @click="deleteSelection">删除</el-button> -->
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
            <el-option label="待处理" value="0"></el-option>
            <el-option label="已出库" value="1"></el-option>
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
  <el-table :data="tableData" border class="table">
    <el-table-column type="expand">
      <template slot-scope="{ row }">
        <!-- v-if="row.state === 0 || row.state === 1" -->
        <el-table size="mini" :data="row.goodsList" border >
          <el-table-column v-if="row.state === 2" type="expand">
            <template slot-scope="{ row }">
              <el-table :data="row.positions" border size="mini">
                <el-table-column label="位置信息">
                  <template slot-scope="{ row }">
                    {{row.line}}通道 {{row.shelf}}货架 {{row.col}}列 {{row.layer}}层
                  </template>
                </el-table-column>
                <el-table-column label="出货数量" prop="outAmount"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="商品编号" prop="uniqueCode"></el-table-column>
          <el-table-column label="商品名称" prop="goodsName"></el-table-column>
          <el-table-column label="库存数量" prop="amount"></el-table-column>
          <el-table-column label="出库数量" prop="outAmount"></el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column prop="uniqueCode" label="出库单编号"></el-table-column>
    <el-table-column prop="applicatingDate" label="开单日期"></el-table-column>
    <el-table-column prop="applicant" label="开单人"></el-table-column>
    <el-table-column prop="resource" label="出库单来源"></el-table-column>
    <el-table-column prop="stateText" label="当前状态"></el-table-column>
    <el-table-column prop="processor" label="处理人"></el-table-column>
    <el-table-column label="操作" width="100">
      <template slot-scope="scope">
        <el-button @click.native.prevent="startStockout(scope.row.uniqueCode)"
          type="text" size="small" v-if="scope.row.state === 0">
          开始出库
        </el-button>
        <el-button @click.native.prevent="stockout(scope.row)"
          type="text" size="small" v-if="scope.row.state === 1">
          录入出库信息
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :current-page="1" :page-sizes="pageInformation.pageSizes"
    :page-size="pageInformation.pageSize" layout="total, sizes, prev, pager, next, jumper"
    :total="pageInformation.total"></el-pagination>
  <el-dialog center title="新建出库单" width="70%" :visible="isDlgShow">
    <el-form size="mini" :model="addGoodsFormData" ref="addGoodsForm"
      class="form" inline label-width="80px">
      <el-row type="flex" justify="start"
        v-for="(goods, index) in addGoodsFormData.goodsList"
        :key="goods.id">
        <el-col :span="6">
          <el-form-item :prop="`goodsList.${index}.goodsName`" :rules="addGoodsRules" label="商品名称">
            <el-autocomplete placeholder="请输入商品名称或编号进行搜索" @select="handleSelect"
              :fetch-suggestions="fetchSuggestions" popper-class="goods-name-popper"
              v-model="addGoodsFormData.goodsList[index].goodsName"
              @focus="focusItem(index)">
              <template slot-scope="{ item }">
                <div class="name">{{item.goodsName}}</div>
                <div class="unique-code">{{item.uniqueCode}}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :prop="`goodsList.${index}.uniqueCode`" label="商品编号">
            <el-input v-model="addGoodsFormData.goodsList[index].uniqueCode" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :prop="`goodsList.${index}.amount`" :rules="addGoodsRules" label="库存数量">
            <el-input v-model="addGoodsFormData.goodsList[index].amount" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :prop="`goodsList.${index}.outAmount`" :rules="addGoodsAmountRules" label="出库数量">
            <el-input v-model.number="addGoodsFormData.goodsList[index].outAmount" @focus="focusItem(index)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" @click="deleteGoods(index)" size="mini">删除</el-button>
        </el-col>
      </el-row>
      <el-button type="primary" @click="addGoods" size="mini">添加商品</el-button>
    </el-form>
    <el-row slot="footer">
      <el-button size="media" @click="cancelCreate">取消</el-button>
      <el-button type="primary" size="media" @click="confirmCreate">确认</el-button>
    </el-row>
  </el-dialog>
  <el-dialog center title="录入出库信息" width="70%" :visible="isEnterDlgShow">
    <el-form size="mini" class="form" :model="enterFormData" inline ref="enterForm">
      <el-card v-for="(goods, index) in enterFormData.goodsList" :key="goods.uniqueCode">
        <el-row type="flex" justify="start" class="mb15">
          <el-col :span="6">商品名称：{{goods.goodsName}}</el-col>
          <el-col :span="6">出库数量：{{goods.outAmount}}</el-col>
        </el-row>
        <el-row v-for="(position, posIdx) of goods.positions" type="flex" justify="start" :key="position.uniqueCode">
          <el-col :span="12">位置： {{position.line}}通道 {{position.shelf}}货架 {{position.col}}列 {{position.layer}}层</el-col>
          <el-col :span="6">库存数量： {{position.amount}}</el-col>
          <el-col :span="6">
            <el-form-item label="出库数量" :prop="`goodsList.${index}.positions.${posIdx}.outAmount`">
              <el-input v-model.number="enterFormData.goodsList[index].positions[posIdx].outAmount" :rules="[{ type: 'number', message: '请输入数值'}]"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-row slot="footer">
      <el-button size="media" @click="cancelStockout">取消</el-button>
      <el-button type="primary" size="media" @click="confirmStockout">确认</el-button>
    </el-row>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    const addGoodsAmountRules = (rule, value, cb) => {
      if ( value === 0) {
        cb(new Error('出库数量不可为0'));
      } else if (value > +this.addGoodsFormData.goodsList[this.focusedGoodsIndex].amount) {
        cb(new Error('出库数量不可大于库存数量'));
      } else {
        cb();
      }
    };
    return {
      username: '',
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
      isDlgShow: false,
      addGoodsFormData: {
        goodsList: [{ id: 0, uniqueCode: '', goodsName: '', amount: 0, outAmount: 0 }]
      },
      addGoodsRules: [
        { required: true, message: '请选择商品', trigger: 'blur' }
      ],
      addGoodsAmountRules: [
        { type: 'number', message: '请输入数值', trigger: 'blur' },
        { validator: addGoodsAmountRules, trigger: 'blur' }
      ],
      isEnterDlgShow: false,
      enterFormData: {
        uniqueCode: '',
        goodsList: []
      },
      stockoutRules: {}
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
        .get('/wms/stockout', {
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
    create () {
      this.isDlgShow = true;
    },
    async fetchSuggestions (queryString, cb) {
      let params = { keyword: queryString };
      let result = await ajax.get('/wms/mini-goods-list', {
        params
      });
      cb(result);
    },
    handleSelect (item) {
      let index = this.focusedGoodsIndex;
      let goods = this.addGoodsFormData.goodsList[index];
      goods.uniqueCode = item.uniqueCode;
      goods.goodsName = item.goodsName;
      goods.amount = +item.amount;
    },
    focusItem (index) {
      this.focusedGoodsIndex = index;
    },
    deleteGoods (index) {
      this.addGoodsFormData.goodsList.splice(index, 1);
    },
    addGoods () {
      let goodsList = this.addGoodsFormData.goodsList;
      let id = goodsList.length ? goodsList[goodsList.length - 1].id + 1 : 0;
      goodsList.push({
        id,
        goodsName: '',
        uniqueCode: '',
        amount: 0,
        outAmount: 0
      });
    },
    cancelCreate () {
      this.addGoodsFormData.goodsList = [];
      this.isDlgShow = false;
    },
    confirmCreate () {
      this.$refs['addGoodsForm'].validate(async (valid) => {
        if (valid) {
          await ajax.post('/wms/create-stockout', {
            username: this.username,
            goodsList: this.addGoodsFormData.goodsList
          });
          this.$message({
            type: 'success',
            message: '创建出库单成功！'
          });
          this.cancelCreate();
          this.getData();
        }
      });
    },
    async startStockout (uniqueCode) {
      await ajax.post('/wms/start-stockout', {
        uniqueCode,
        username: this.username
      });
      this.$message({
        message: '更改状态成功',
        type: 'success'
      });
      this.getData();
    },
    async stockout (row) {
      this.enterFormData.uniqueCode = row.uniqueCode;
      // 获取商品的位置信息
      let goodsList = await ajax.post('/wms/get-goods-arr', {
        uniqueCodeList: row.goodsList.map(v => v.uniqueCode)
      });
      for (let i = 0; i < goodsList.length; i++) {
        goodsList[i].positions.forEach(p => {
          p.outAmount = 0;
        });
        goodsList[i].outAmount = row.goodsList[i].outAmount;
      }
      this.enterFormData.goodsList = goodsList;
      this.isEnterDlgShow = true;

    },
    cancelStockout () {
      this.enterFormData.uniqueCode = '';
      this.enterFormData.goodsList = [];
      this.isEnterDlgShow = false;
    },
    confirmStockout () {
      this.$refs['enterForm'].validate(async (valid) => {
        if (valid) {
          await ajax.post('/wms/enter-stockout', {
            ...this.enterFormData
          });
          this.$message({
            message: '录入成功！',
            type: 'success'
          });
          this.getData();
          this.cancelStockout();
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
.stockout-management {
  .form .el-form-item__content {
    width: calc(100% - 80px);
  }
}
</style>

