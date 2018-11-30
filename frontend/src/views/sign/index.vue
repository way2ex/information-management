<script>
export default {
  name: 'sign',
  data () {
    return {};
  },
  created () {},
  methods: {}
};
</script>
<template>
    <main class="wrapper">
        <div class="container">
            <h1>物流信息管理系统</h1>
            <div class="router-wrapper">
              <transition name="fade"><router-view class="router-view"></router-view></transition>
            </div>
        </div>
        <ul class="bg-bubbles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </main>
</template>
<style lang="less" scoped>
// @import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300);
@bgColor: #53e3a6;
@containerHeight: 400px;
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-weight: 300;
  color: white;
}
.wrapper {
  background: linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
  position: absolute;
  top: 0%;
  left: 0;
  width: 100%;
  height: 100%;
  // margin-top: -$containerHeight / 2;
  overflow: hidden;
}

.container {
  width: 400px;
  height: 340px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0% auto 0 auto;
  padding: 0px 0;
  // height: $containerHeight;
  text-align: center;
  transform: translate(-50%, -50%);
  z-index: 2;

  h1 {
    font-size: 40px;
    transition-duration: 800ms;
    transition-timing-function: ease-in-put;
    font-weight: 200;
  }
  .router-wrapper {
    position: relative;
  }
}
.bg-bubbles {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
  top: 0;

  li {
    position: absolute;
    width: 40px;
    height: 40px;
    list-style: none;
    display: block;
    background-color: rgba(255, 255, 255, 0.15);
    bottom: -100px;
    animation: suqare 20s infinite;

    &:nth-child(1) {
      left: 5%;
    }
    &:nth-child(2) {
      left: 15%;
      width: 80px;
      height: 80px;
      animation-delay: 2s;
      animation-duration: 17s;
    }
    &:nth-child(3) {
      left: 25%;
      animation-delay: 4s;
    }
    &:nth-child(4) {
      left: 35%;
      width: 60px;
      height: 60px;
      animation-duration: 22s;
      background-color: rgba(255, 255, 255, 0.25);
    }
    &:nth-child(5) {
      left: 70%;
    }
    &:nth-child(6) {
      left: 80%;
      width: 120px;
      height: 120px;
      animation-delay: 3s;
      background-color: rgba(255, 255, 255, 0.2);
    }
    &:nth-child(7) {
      left: 30%;
      width: 160px;
      height: 160px;
      animation-delay: 7s;
    }
    &:nth-child(8) {
      left: 55%;
      width: 40px;
      height: 40px;
      animation-delay: 15s;
      animation-duration: 30s;
    }
    &:nth-child(9) {
      left: 25%;
      width: 20px;
      height: 20px;
      animation-delay: 2s;
      animation-duration: 25s;
      background-color: rgba(255, 255, 255, 0.3);
    }
    &:nth-child(10) {
      left: 90%;
      width: 160px;
      height: 160px;
      animation-delay: 11s;
    }
    &:nth-child(11) {
      left: 40%;
      width: 60px;
      height: 60px;
      animation-delay: 15s;
    }
    &:nth-child(2) {
      left: 35%;
      width: 80px;
      height: 80px;
      animation-delay: 4s;
      animation-duration: 17s;
    }
  }

  @keyframes suqare {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-130vh) rotate(600deg);
    }
  }
}
</style>
