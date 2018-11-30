<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
html,
body {
  /* min-width: 960px; */
}
html,
body,
#app,
.component-wrapper {
  height: 100%;
  margin: 0;
  padding: 0;
}
::selection {
  background: #53e3a6;
  color: white;
}
.base-color {
  color: #51c3a4;
}
/* animate css */
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
@keyframes shake {
  from,
  to {
    transform: translate3d(0, 0, 0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(-10px, 0, 0);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translate3d(10px, 0, 0);
  }
}

.shake {
  animation-name: shake;
}
.is-error .shake {
  animation-name: shake;
}

/* 设置路由组件的过渡效果 */
.fade-enter-active,
.fade-leave-active {
  position: absolute;
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  position: absolute;
}
</style>
