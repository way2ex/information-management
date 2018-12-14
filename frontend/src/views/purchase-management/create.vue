<template>
  <div>
    <el-row justify="start" type="flex" class="tal mv10">
      <el-col :span="2"><el-button type="primary" @click="handleAddGoods">添加商品</el-button></el-col>
      <el-col :span="2"><el-button type="primary" @click="submitForm('form')">确定申请</el-button></el-col>
    </el-row>
    <el-form :model="form" :rules="rules" ref="form"
      class="form" label-position="right" label-width="80px">
      <el-row type="flex" justify="start">
        <el-col :span="6">
          <el-form-item label="仓库名称" prop="houseName">
            <el-input v-model="form.houseName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购员" prop="purchaser">
            <el-input v-model="form.purchaser" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start">
        <el-col :span="12">
          <el-form-item label="备注" prop="extra">
            <el-input type="textarea" :rows="3" v-model="form.extra"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table border :data="goodsList" @selection-change="selectionChange">
      <el-table-column type="selection" ></el-table-column>
      <el-table-column label="商品名称" prop="goodsName"></el-table-column>
      <el-table-column label="单价" prop="price"></el-table-column>
      <el-table-column label="数量" prop="amount"></el-table-column>
      <el-table-column label="总价" prop="totalPrice"></el-table-column>
      <el-table-column label="供应商" prop="provider"></el-table-column>
    </el-table>
    <el-dialog width="60%" title="添加商品" :visible="isAddGoodsShow" :before-close="handleClose">
      <el-form :model="addGoodsForm" label-position="right" label-width="80px"
        :rules="addGoodsRules" ref="addGoodsForm">
        <el-row justify="start" type="flex">
          <el-col :span="12"><el-form-item label="商品名称" prop="goodsName"><el-input v-model="addGoodsForm.goodsName"></el-input></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="单价" prop="price"><el-input v-model="addGoodsForm.price" @change="calculateTotal"><i slot="prefix" class="fa fa-yen-sign"></i></el-input></el-form-item></el-col>
        </el-row>
        <el-row justify="start" type="flex">
          <el-col :span="12"><el-form-item label="数量" prop="amount"><el-input v-model="addGoodsForm.amount" @change="calculateTotal"></el-input></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="总价" prop="totalPrice"><el-input v-model="addGoodsForm.totalPrice" readonly ><i slot="prefix" class="fa fa-yen-sign"></i></el-input></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="供应商" prop="provider"><el-input v-model="addGoodsForm.provider"></el-input></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-button @click="cancelAddGoods">取消</el-button>
          <el-button type="primary" @click="confirmAddGoods">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isAddGoodsShow: false,
      form: {
        houseName: '',
        purchaser: sessionStorage.getItem('username'),
        extra: ''
      },
      addGoodsForm: {
        goodsName: '笔记本电脑',
        price: '4000.00',
        amount: 10,
        totalPrice: '40000.00',
        provider: '中关村联想旗舰店'
      },
      goodsList: [],
      selection: [],
      rules: {
        houseName: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
        purchaser: [
          { required: true, message: '请输入采购人员名称', trigger: 'blur' }
        ]
      },
      addGoodsRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        provider: [
          { required: true, message: '请输入商品供应商', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // resetForm (formName) {
    //   this.$refs[formName].resetFields();
    // },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let form = { ...this.form };
          let date = new Date();
          let year = date.getFullYear();
          let month = (date.getMonth() + 1).toString().padStart(2, '0');
          let day = date.getDate().toString().padStart(2, '0');
          let hour = date.getHours().toString().padStart(2, '0');
          let min = date.getMinutes().toString().padStart(2, '0');
          let sec = date.getSeconds().toString().padStart(2, '0');
          date = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
          form.purchasingDate = date;
          form.state = 0;
          form.stateText = '未审核';
          form.goodsList = this.goodsList;

          await ajax.post('/purchase/add', form);
          this.$message({
            type: 'success',
            message: '申请成功，请耐心等待审核！'
          });
          // this.resetForm('form');
        }
      });
    },
    calculateTotal () {
      let { price, amount } = this.addGoodsForm;
      let length = price.split('.')[0].length;
      price = parseFloat(price).toPrecision(length + 2);
      amount = +amount;
      if (price === 0 || amount === 0) {
        this.addGoodsForm.totalPrice = 0.00;
        return;
      }
      this.addGoodsForm = {
        ...this.addGoodsForm,
        price,
        totalPrice: (price * amount).toFixed(2)
      };
    },
    handleAddGoods () {
      this.isAddGoodsShow = true;
    },
    handleClose (done) {
      this.cancelAddGoods();
    },
    cancelAddGoods () {
      this.isAddGoodsShow = false;
      this.$refs['addGoodsForm'].resetFields();
    },
    confirmAddGoods () {
      this.$refs['addGoodsForm'].validate((valid) => {
        if (valid) {
          let id = this.goodsList.length ? this.goodsList[this.goodsList.length - 1].id + 1 : 0;
          this.goodsList.push({
            id,
            state: 0,
            stateText: '未审核',
            ...this.addGoodsForm
          });
          this.cancelAddGoods();
        }
      });
    },
    selectionChange (selection) {
      this.selection = selection.map(v => v.id);
    }
  }
};
</script>
<style lang="less" scoped>
.form {
  margin: auto;
  .el-select {
    width: 100%;
  }
}
</style>
