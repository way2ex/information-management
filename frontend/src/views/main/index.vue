<script>
export default {
  data () {
    return {
      defaultActive: '/main',
      navMenuItems: [
        {
          type: 'single',
          title: '采购管理',
          iconClass: 'fa-shopping-cart',
          index: '/main/purchase'
        },
        {
          type: 'composite',
          title: '仓储管理',
          iconClass: 'fa-home',
          index: '/main/wms/',
          children: [
            {
              title: '入库管理',
              index: '/main/wms/stock-in-req',
              iconClass: 'fa-home'
            },
            {
              title: '盘点管理',
              index: '/main/wms/stocktaking'
            },
            {
              title: '库存商品管理',
              index: '/main/wms/goods-management',
              iconClass: 'fa-cubes'
            },
            {
              title: '货位管理',
              index: '/main/wms/locations',
              iconClass: ''
            }
          ]
        },
        {
          type: 'composite',
          title: '调拨管理',
          iconClass: 'fa-ticket',
          index: '/main/transship',
          children: [
            {
              title: '调拨申请',
              index: '/main/transship/application'
            },
            {
              title: '调拨审核',
              index: '/main/transship/check'
            },
            {
              title: '调拨执行',
              index: '/main/transship/execution'
            }
          ]
        },
        // {
        //   type: 'composite',
        //   title: '盘点管理',
        //   iconClass: 'fa-ticket',
        //   index: '/main/stocktaking',
        //   children: [
        //     {
        //       title: '盘点开单',
        //       index: '/main/stocktaking/application'
        //     },
        //     {
        //       title: '盘点执行',
        //       index: '/main/transship/execution'
        //     }
        //   ]
        // },
        {
          type: 'single',
          title: '用户管理',
          index: '/main/um',
          iconClass: 'fa-users'
        }
      ]
    };
  },
  computed: {
    breadCrumb () {
      let breadCrumb = this.$store.state.breadCrumb;
      if (breadCrumb.length === 0) {
        breadCrumb = [{ name: '首页', to: '/' }];
      }
      return breadCrumb;
    }
  },
  created () {
    this.defaultActive = this.$route.meta.activeMenuItem;
    console.log(this.$route);
  },
  methods: {
    goTo (index, indexPath) {
      // console.log(index);
      // console.log(indexPath);
    }
  }
};
</script>
<template>
  <!-- <div class="component-wrapper"> -->
  <el-container>
    <el-aside width="140px" class="aside-wrapper">
      <aside class="aside">
        <h1 class="logo">
          <a href="/" title="interface management"></a>
        </h1>
        <el-menu class="nav-menu" :default-active="defaultActive" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="goTo" :router="true">
          <el-menu-item-group class="nav-menu-group">
            <template v-for="(item) of navMenuItems">
              <el-submenu v-if="item.type === 'composite'" :index="item.index" :key="item.index">
                <template slot="title">
                  <i class="fa" :class="item.iconClass"></i>
                  <span>{{ item.title }}</span>
                </template>
                <el-menu-item v-for="item in item.children" :index="item.index" :key="item.index" :route="item.route">
                  <span slot="title">{{ item.title }}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="item.index" :key="item.index" :route="item.route">
                <i class="fa" :class="item.iconClass"></i>
                <span slot="title">{{ item.title }}</span>
              </el-menu-item>
            </template>
          </el-menu-item-group>
        </el-menu>
      </aside>
    </el-aside>
    <el-container class="main">
      <el-header class="header ph10" style="height: 50px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <template  v-for="(item, index) in breadCrumb">
            <el-breadcrumb-item v-if="index !== (breadCrumb.length - 1)" :to="item.to" :key="item.name">{{ item.name }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else :to="item.to" :key="item.name">
             {{ item.name }}
            </el-breadcrumb-item>
          </template>
        </el-breadcrumb>

      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
  <!-- </div> -->
</template>

<style lang="less" scoped>
.el-container {
  min-height: 100%;
}
.aside-wrapper {
  position: absolute;
  height: 100%;
}
.aside {
  @settingMenuHeight: 30px;
  @logoHeight: 50px;

  background-color: rgb(84, 92, 100);
  height: 100%;
  padding-top: @logoHeight;
  box-sizing: border-box;
  text-align: left;

  .logo {
    position: absolute;
    top: 0;
    margin: 0;
    padding: 0;
    height: @logoHeight;
    width: 100%;
    background: url(../../assets/images/logo.png) no-repeat;
    background-size: contain;
    a {
      display: block;
      height: 100%;
    }
  }

  .nav-menu {
    width: 140px;
    height: 100%;
    box-sizing: border-box;
    border: none;
    padding-bottom: @settingMenuHeight;
  }

  .el-submenu .el-menu-item {
    min-width: 140px;
  }
  .nav-menu-group {
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .setting-menu-group {
    width: 100%;
    height: @settingMenuHeight;
    position: absolute;
    text-align: center;
    /* bottom: -@settingMenuHeight; */
  }

  .el-menu-item-group .fa, .el-menu-item .fa {
    line-height: 16px;
    font-size: 16px;
    height: 16px;
    margin-right: 5px;
  }
}
.main {
  height: 100vh;
  margin-left: 140px;
  overflow: auto;
}
.header {
  @headerHeight: 50px;
  box-shadow: 0 0 5px rgba(0,0,0,0.25);
  position: sticky;
  top: 0;
  z-index: 2;
  background: white;
  .el-breadcrumb {
    height: @headerHeight;
    line-height: @headerHeight;
    color: #999;
  }
}
.el-main {
  padding: 10px;
}
</style>
