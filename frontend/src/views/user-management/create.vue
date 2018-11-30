<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" class="form" label-position="right" label-width="80px">
      <el-form-item label="用户名称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input v-model="form.repassword"  type="password"></el-input>
      </el-form-item>
      <el-form-item label="部门名称" prop="department">
        <el-input v-model="form.department"></el-input>
      </el-form-item>
      <el-form-item label="工作职位" prop="position">
        <el-input v-model="form.position"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phoneNumber">
        <el-input v-model="form.phoneNumber"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="form.state" placeholder="请选择">
          <el-option label="正常" value="正常"></el-option>
          <el-option label="禁用" value="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">确认新建</el-button>
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

