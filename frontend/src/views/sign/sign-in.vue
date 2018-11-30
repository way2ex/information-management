<template>
  <div class="signup-wrapper">
    <el-form :model="form" :rules="rules" ref="form" class="sign-form">
      <el-form-item label="" prop="username">
        <el-input class="input-item" type="text" v-model="form.username" placeholder="username"></el-input>
      </el-form-item>
      <el-form-item label="" prop="password">
        <el-input class="input-item" type="password" v-model="form.password" placeholder="password"></el-input>
      </el-form-item>
      <el-form-item class="btn-wrapper">
        <el-button type="primary" @click="signIn('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'sign-in',
  data () {
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else if (
        value.length < 3 ||
        value.length > 20 ||
        !/^[A-Za-z]+$/.test(value)
      ) {
        callback(new Error('用户名支持3~20位英文字母'));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (
        value.length < 3 ||
        value.length > 20 ||
        !/^[0-9A-Za-z]+$/.test(value)
      ) {
        callback(new Error('密码支持3~20位数字与英文字母的组合'));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [{ validator: validateUsername }],
        password: [{ validator: validatePass }]
      }
    };
  },
  created () {},
  mounted () {
    this.initAnimationToForm();
  },
  methods: {
    signIn (formName) {
      this.$refs[formName]
        .validate()
        .then(() => {
          this.$store.dispatch('login', this.form);
        })
        .catch(() => {
          this.animateInvalid();
        });
    },
    initAnimationToForm () {
      var items = document.querySelectorAll('.el-input__inner, .el-textarea__inner');
      items.forEach(item => {
        item.classList.add('animated');
        item.addEventListener('animationend', () => {
          item.classList.remove('shake');
        });
      });
    },
    animateInvalid () {
      var inputs = document.querySelectorAll('.el-form-item.is-error .el-input__inner');
      inputs.forEach((input) => {
        input.classList.add('shake');
      });
    }
  }
};
</script>

<style lang="less">
.signup-wrapper {
  width: 300px;
}
.sign-form {
  padding: 20px 0 0 0;
  position: relative;
  margin: auto;
  z-index: 2;

  ::-webkit-input-placeholder {
    /* WebKit browsers */
    font-family: "Source Sans Pro", sans-serif;
    color: white;
    font-weight: 300;
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    font-family: "Source Sans Pro", sans-serif;
    color: white;
    opacity: 1;
    font-weight: 300;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    font-family: "Source Sans Pro", sans-serif;
    color: white;
    opacity: 1;
    font-weight: 300;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10+ */
    font-family: "Source Sans Pro", sans-serif;
    color: white;
    font-weight: 300;
  }
  .input-item input {
    display: block;
    appearance: none;
    outline: none;
    border: 1px solid rgba(#ffffff, 0.4);
    background-color: rgba( #ffffff, 0.2);
    width: 250px;

    border-radius: 4px;
    padding: 10px 15px;
    margin: 0 auto 10px auto;
    text-align: center;
    font-size: 17px;
    color: white;

    transition: width 0.25s;
    font-weight: 300;

    &:hover {
      background-color: rgba(white, 0.4);
    }
    &:focus {
      background-color: #ffffff;
      width: 300px;
      color: #53e3a6;
    }
  }
  .el-form-item:last-child {
    margin-bottom: 0;
  }
  .el-button {
    appearance: none;
    outline: 0;
    background-color: white;
    border: 0;
    padding: 10px 15px;
    color: #53e3a6;
    border-radius: 3px;
    width: 250px;
    cursor: pointer;
    font-size: 18px;
    transition-duration: 0.25s;

    &:hover {
      background-color: rgb(245, 247, 249);
      color: #53e3a6;
    }
    &:active {
      background-color: white;
    }
  }
  .el-form-item__error {
    left: 25px;
    color: white;
  }
  .el-form-item.is-error .el-input__inner {
    border-color: white;
  }
}
.sm-tip {
  color: white;
  text-decoration: none;
  display: block;
  font-size: 14px;
  float: right;
  margin-right: 25px;
}
.el-form-item.is-success .el-input__inner:focus {
   border-color: rgba(#ffffff, 0.9);
}
.el-form-item.is-success .el-input__inner {
  border-color: rgba(#ffffff, 0.9);
}
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px rgba(116, 207, 182, 1) inset;
    border-color: white;
    -webkit-text-fill-color: white !important;
}
</style>
