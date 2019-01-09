<template>
<div class="transship-application">
  <el-row justify="start" type="flex">
    <el-button @click="create" type="primary">申请调拨</el-button>
  </el-row>
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
              {{scope.row.inStartLine}}通道 {{scope.row.inStartShelf}}货架 {{scope.row.inStartCol}}列 {{scope.row.inStartLayer}}层
              <span class="divider">至</span>
              {{scope.row.inEndLine}}通道 {{scope.row.inEndShelf}}货架 {{scope.row.inEndCol}}列 {{scope.row.inEndLayer}}层
            </template>
          </el-table-column>
          <el-table-column label="调入货位">
            <template slot-scope="scope">
              {{scope.row.inStartLine}}通道 {{scope.row.inStartShelf}}货架 {{scope.row.inStartCol}}列 {{scope.row.inStartLayer}}层
              <span class="divider">至</span>
              {{scope.row.inEndLine}}通道 {{scope.row.inEndShelf}}货架 {{scope.row.inEndCol}}列 {{scope.row.inEndLayer}}层
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
    <el-table-column prop="processor" label="审核管理员"></el-table-column>
    <el-table-column prop="extra" label="备注"></el-table-column>
    <!-- <el-table-column prop="checkExtra" label="审核理由"></el-table-column> -->
    <el-table-column label="操作" width="90">
      <template slot-scope="scope">
        <el-button size="mini" @click.native.prevent="updateRow(scope.$index)" type="primary" :disabled="scope.row.state !== 0" >修改</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :current-page="1" :page-sizes="pageInformation.pageSizes" :page-size="pageInformation.pageSize" layout="total, sizes, prev, pager, next, jumper"
    :total="pageInformation.total"></el-pagination>
  <el-dialog title="添加商品" :visible="isDlgShow" center width="70%">
    <el-form :model="createFormData" ref="form" :rules="rules" label-width="90px" size="mini" class="form">
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-form-item label="商品名称" prop="goodsName">
            <el-autocomplete placeholder="请输入商品名称或编号进行搜索"
              v-model="createFormData.goodsName" @select="handleSelect"
              :fetch-suggestions="fetchSuggestions" popper-class="goods-name-popper">
              <template slot-scope="{ item }">
                <div class="name">{{item.goodsName}}</div>
                <div class="unique-code">{{item.uniqueCode}}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品编号" prop="uniqueCode">
            <el-input v-model="createFormData.goodsUniqueCode" readonly ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="可调拨数量" prop="amount">
            <el-input v-model="createFormData.amount" readonly ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="section-header mv10">调拨详情
        <el-button type="primary" size="mini" style="margin-left: 30px;" @click="addDetail">增加调拨信息</el-button>
      </div>
      <el-card v-for="(detail) in createFormData.details"
        :key="detail.id" class="transship-create-card">
        <el-row type="flex" justify="start">
          <el-col :span="6">
            <el-form-item label="调拨数量" label-width="100px">
              <el-input v-model="detail.amount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" label-width="100px">
              <el-input type="textarea" v-model="detail.extra" :rows="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="2">
            <el-button size="mini" type="danger" icon="el-icon-delete"
              @click="deleteDetail(detail.id)"></el-button>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="8">
            <el-form-item label="调出货位:" label-width="100px">
              <el-input v-model="detail.outStartLine">
                <template slot="append">通道</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.outStartShelf">
                <template slot="append">货架</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.outStartCol">
                <template slot="append">列</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.outStartLayer">
                <template slot="append">层</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="8">
            <el-form-item label="至" label-width="100px">
              <el-input v-model="detail.outEndLine">
                <template slot="append">通道</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.outEndShelf">
                <template slot="append">货架</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.outEndCol">
                <template slot="append">列</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.outEndLayer">
                <template slot="append">层</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="8">
            <el-form-item label="调入货位:">
              <el-input v-model="detail.inStartLine">
                <template slot="append">通道</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.inStartShelf">
                <template slot="append">货架</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.inStartCol">
                <template slot="append">列</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.inStartLayer">
                <template slot="append">层</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start">
          <el-col :span="8">
            <el-form-item label="至">
              <el-input v-model="detail.inEndLine">
                <template slot="append">通道</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.inEndShelf">
                <template slot="append">货架</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.inEndCol">
                <template slot="append">列</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model="detail.inEndLayer">
                <template slot="append">层</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
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
        goodsUniqueCode: '',
        goodsName: '',
        amount: 0,
        extra: '',
        details: []
      },
      rules: {
        goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goodsUniqueCode: [{ required: true, message: '请输入商品编号', trigger: 'blur' }]
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
    async fetchSuggestions (queryString, cb) {
      let params = { keyword: queryString };
      let result = await ajax.get('/wms/mini-goods-list', {
        params
      });
      cb(result);
    },
    handleSelect (item) {
      this.createFormData.goodsName = item.goodsName;
      this.createFormData.goodsUniqueCode = item.uniqueCode;
      this.createFormData.amount = item.amount;
      this.$refs['form'].validate();
    },
    addDetail () {
      let id = this.createFormData.details.length;
      this.createFormData.details.push({
        id: id,
        amount: 10,
        outStartLine: '3',
        outStartShelf: '3',
        outStartCol: '3',
        outStartLayer: '3',
        outEndLine: '3',
        outEndShelf: '3',
        outEndCol: '3',
        outEndLayer: '3',
        inStartLine: '3',
        inStartShelf: '3',
        inStartCol: '3',
        inStartLayer: '3',
        inEndLine: '3',
        inEndShelf: '3',
        inEndCol: '3',
        inEndLayer: '3'
      });
    },
    deleteDetail (id) {
      let index = this.createFormData.details.findIndex((v) => { return +id === +v.id; });
      if (index !== -1) {
        this.createFormData.details.splice(index, 1);
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
          let transshipAmount = this.createFormData.details.reduce((acc, cur) => { return acc + +cur.amount; }, 0);
          // this.goodsList.push({
          //   ...this.createFormData,
          //   transshipAmount: transshipAmount
          // });
          await ajax.post('/wms/apply-transship', {
            username: sessionStorage.getItem('username'),
            transshipAmount: transshipAmount,
            ...this.createFormData
          });
          this.$message({
            message: '提交成功',
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
    deleteSelection () {},
    updateRow (row) {
      console.log(row);
    },
    async saveApply () {
      if (!this.goodsList.length) {
        this.$message({
          message: '请添加要调拨的商品',
          type: 'warning'
        });
        return;
      }
      await ajax.post('/wms/transship-apply', {
        username: sessionStorage.getItem('username'),
        goodsList: this.goodsList
      });
      this.$message({
        message: '提交成功',
        type: 'success'
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
