<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" class="form" label-position="right" label-width="80px">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="form.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="包装规格" prop="packingSpec">
        <el-input v-model="form.packingSpec"></el-input>
      </el-form-item>
      <el-form-item label="供应商" prop="provider">
        <el-input v-model="form.provider" type="text"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="amount">
        <el-input v-model="form.amount"></el-input>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="采购员" prop="purchaser">
        <el-input v-model="form.purchaser"></el-input>
      </el-form-item>
      <el-form-item label="采购日期" prop="purchasingDate">
        <el-input v-model="form.purchasingDate"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="extra">
        <el-input v-model="form.extra"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">申请</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.repassword !== '') {
          this.$refs.form.validateField('repassword');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    return {
      form: {
        nickname: '',
        username: '',
        password: '',
        repassword: '',
        department: '',
        position: '',
        phoneNumber: '',
        state: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        repassword: [
           { validator: validatePass2, trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入工作职位', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let form = { ...this.form };
          delete form.repassword;
          let res = await ajax.post('/user', form);
          this.$message({
            type: 'success',
            message: '创建成功！'
          });
          this.resetForm();
        }
      });
    }
  }
}
</script>
<style lang="less" scoped>
.form {
  width: 50%;
  margin: auto;
  .el-select {
    width: 100%;
  }
}
</style>

