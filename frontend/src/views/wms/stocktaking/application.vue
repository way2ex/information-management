<template>
<div class="stocktaking-application">
  <el-row justify="start" type="flex" class="mv10">
    <el-button @click="create" type="primary">申请盘点</el-button>
  </el-row>
  <el-form inline :model="queryForm" class="query-form" size="small" label-width="70px">
    <el-row justify="start" type="flex">
      <el-col :span="6">
        <el-form-item label="盘点编号">
          <el-input v-model="queryForm.uniqueCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="当前状态" label-position="right">
          <el-select v-model="queryForm.state" width="188px">
            <el-option label="所有" value=""></el-option>
            <el-option label="未通过" :value="-1"></el-option>
            <el-option label="未审核" :value="0"></el-option>
            <el-option label="已通过待处理" :value="1"></el-option>
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
  </el-form>
  <el-table :data="tableData" border size="medium" class="table" style="margin-top: 20px;">
    <el-table-column type="selection" width="30"></el-table-column>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-table border size="mini" :data="props.row.goodsList">
          <el-table-column prop="uniqueCode" label="商品编号"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column prop="amount" label="数量"></el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column prop="uniqueCode" label="盘点单号"></el-table-column>
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
    <el-table-column prop="processor" label="审核管理员"></el-table-column>
    <el-table-column prop="extra" label="备注"></el-table-column>
    <!-- <el-table-column label="操作" width="90">
    </el-table-column> -->
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :current-page="1" :page-sizes="pageInformation.pageSizes" :page-size="pageInformation.pageSize" layout="total, sizes, prev, pager, next, jumper"
    :total="pageInformation.total"></el-pagination>
  <el-dialog title="添加商品" :visible="isDlgShow" center width="70%">
    <el-form :model="createFormData" ref="form" label-width="90px" size="mini" class="form">
      <el-row type="flex" justify="start">
        <el-col :span="16">
          <el-form-item label="备注" prop="extra">
            <el-input type="textarea" :rows="3" v-model="createFormData.extra"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" v-for="(goods, index) in createFormData.goodsList" :key="goods.id">
        <el-col :span="6">
          <el-form-item label="商品名称" :prop="`goodsList.${index}.goodsName`" :rules="{ required: true, message: '商品不能为空', trigger: 'change' }">
            <el-autocomplete placeholder="请输入商品名称或编号进行搜索"
              v-model="goods.goodsName" @select="handleSelect" @focus="focusOn(goods.id)"
              :fetch-suggestions="fetchSuggestions" popper-class="goods-name-popper">
              <template slot-scope="{ item }">
                <div class="name">{{item.goodsName}}</div>
                <div class="unique-code">{{item.uniqueCode}}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品编号" prop="uniqueCode">
            <el-input v-model="goods.uniqueCode" readonly ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="当前数量" prop="amount">
            <el-input v-model="goods.amount" readonly ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button size="mini" type="danger" icon="el-icon-delete"
              @click="deleteGoods(goods.id)"></el-button>
        </el-col>
      </el-row>
      <div class="section-header mv10">
        <el-button type="primary" size="mini" style="margin-left: 30px;" @click="addGoods">增加盘点商品</el-button>
      </div>
    </el-form>
    <el-row slot="footer">
      <el-button size="media" @click="cancelAddGoods">取消</el-button>
      <el-button type="primary" size="media" @click="confirmAddGoods">确认</el-button>
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
        applicant: sessionStorage.getItem('username'),
        state: ''
      },
      pageInformation: {
        pageSizes: [20, 50, 100],
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      tableData: [],
      isDlgShow: false,
      createFormData: {
        extra: '',
        goodsList: []
      },
      focusedGoodsId: ''
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
        .get('/wms/stocktaking', {
          params: condition
        })
        .then(data => {
          this.tableData = data.data;
          this.pageInformation = { ...this.pageInformation, total: data.total };
        });
    },
    async fetchSuggestions (queryString, cb) {
      let params = { keyword: queryString };
      let result = await ajax.get('/wms/mini-goods-list', {
        params
      });
      cb(result);
    },
    handleSelect (item) {
      if (this.createFormData.goodsList.find((value) => value.uniqueCode === item.uniqueCode)) {
        this.$message({
          message: '列表中已存在相同的商品',
          type: 'error'
        });
        return;
      }
      let index = this.createFormData.goodsList.findIndex((value) => value.id === this.focusedGoodsId);
      this.createFormData.goodsList[index] = {
        id: this.focusedGoodsId,
        goodsName: item.goodsName,
        uniqueCode: item.uniqueCode,
        amount: item.amount
      };
      this.$refs['form'].validate();
    },
    focusOn (id) {
      this.focusedGoodsId = id;
    },
    addGoods () {
      let goodsList = this.createFormData.goodsList;
      let id = goodsList.length ? goodsList[goodsList.length - 1].id + 1 : 0;
      this.createFormData.goodsList.push({
        id: id, uniqueCode: '', goodsName: '', amount: 0
      });
    },
    deleteGoods (id) {
      let index = this.createFormData.goodsList.findIndex((v) => { return +id === +v.id; });
      if (index !== -1) {
        this.createFormData.goodsList.splice(index, 1);
      } else {
      }
    },
    cancelAddGoods () {
      this.$refs['form'].resetFields();
      this.isDlgShow = false;
    },
    confirmAddGoods () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          await ajax.post('/wms/apply-stocktaking', {
            username: sessionStorage.getItem('username'),
            ...this.createFormData
          });
          this.$message({
            message: '申请成功',
            type: 'success'
          });
          this.isDlgShow = false;
          this.getData();
        }
      });
    },
    create () {
      this.isDlgShow = true;
    },
    deleteSelection () {}
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
  .goods-name-popper {
  li {
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .unique-code {
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}
}
</style>
