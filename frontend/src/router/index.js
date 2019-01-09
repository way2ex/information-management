import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import * as types from '../store/mutation-types';
import { Loading } from 'element-ui';

import Sign from '@/views/sign/index';
import SignIn from '@/views/sign/sign-in';

import Main from '@/views/main';
// import IM from '@/views/information-management';
// import IM_LIST from '@/views/information-management/list';
// import IM_CREATE from '@/views/information-management/create';

import UM from '@/views/user-management';
import UM_LIST from '@/views/user-management/list';
import UM_CREATE from '@/views/user-management/create';
import UM_UPDATE from '@/views/user-management/update';

import Purchase from '@/views/purchase-management';
import PURCHASE_LIST from '@/views/purchase-management/list';
import PURCHASE_CREATE from '@/views/purchase-management/create';

import StockIn from '@/views/wms/stock-in';
import StockInReqLIST from '@/views/wms/stock-in/stock-in-req';

import GoodsManagement from '@/views/wms/goods-management/index';
import LocationsManagement from '@/views/wms/locations/index';

import Transshipment from '@/views/wms/transshipment/index';
import TransshipApplication from '@/views/wms/transshipment/application';
import TransshipCheck from '@/views/wms/transshipment/check';
import TransshipExecution from '@/views/wms/transshipment/execution';

import Stocktaking from '@/views/wms/stocktaking/index';
import StocktakingApplication from '@/views/wms/stocktaking/application';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/main',
      component: Main,
      children: [
        // {
        //   path: '',
        //   redirect: 'im'
        // },
        {
          path: 'purchase',
          component: Purchase,
          meta: { name: '采购管理' },
          children: [
            {
              path: '',
              component: PURCHASE_LIST,
              name: 'purchase',
              meta: { activeMenuItem: '/main/purchase' }
            },
            {
              path: 'create',
              component: PURCHASE_CREATE,
              name: 'purchase-create',
              meta: { name: '申请采购', activeMenuItem: '/main/purchase' }
            }
          ]
        },
        {
          path: 'wms',
          component: StockIn,
          meta: { name: '仓储管理' },
          children: [
            {
              path: 'stock-in-req',
              component: StockInReqLIST,
              name: 'stock-in-req',
              meta: { name: '入库管理', activeMenuItem: '/main/wms/stock-in-req' }
            },
            {
              path: 'goods-management',
              component: GoodsManagement,
              name: 'goods-management',
              meta: { name: '库存商品管理', activeMenuItem: '/main/wms/goods-management' }
            },
            {
              path: 'locations',
              component: LocationsManagement,
              name: 'locations',
              meta: { name: '货位管理', activeMenuItem: '/main/wms/locations' }
            }
          ]
        },
        {
          path: 'transship',
          component: Transshipment,
          meta: { name: '调拨管理' },
          children: [
            {
              path: 'application',
              component: TransshipApplication,
              name: 'transship-application',
              meta: { name: '调拨申请', activeMenuItem: '/main/transship/application' }
            },
            {
              path: 'check',
              component: TransshipCheck,
              name: 'transship-check',
              meta: { name: '调拨审核', activeMenuItem: '/main/transship/check' }
            },
            {
              path: 'execution',
              component: TransshipExecution,
              name: 'transship-execution',
              meta: { name: '调拨执行', activeMenuItem: '/main/transship/execution' }
            }
          ]
        },
        {
          path: 'stocktaking',
          component: Stocktaking,
          meta: { name: '盘点管理' },
          children: [
            {
              path: 'application',
              component: StocktakingApplication,
              name: 'stocktaking-application',
              meta: { name: '盘点申请', activeMenuItem: '/main/stocktaking/application' }
            }
          ]
        },
        {
          path: 'um',
          component: UM,
          meta: { name: '用户管理' },
          children: [
            {
              path: '',
              component: UM_LIST,
              name: 'um',
              meta: { activeMenuItem: '/main/um' }
            },
            {
              path: 'create',
              component: UM_CREATE,
              name: 'um-create',
              meta: { name: '新建用户', activeMenuItem: '/main/um' }
            },
            {
              path: 'update/:id',
              component: UM_UPDATE,
              name: 'um-update',
              meta: { name: '修改用户', activeMenuItem: '/main/um' }
            }
          ]
        }
      ]
    },
    {
      path: '/sign',
      component: Sign,
      children: [
        { path: '', component: SignIn },
        { path: 'signin', component: SignIn, name: 'signin' }
      ]
    }
  ]
});

// router guard
var loading;
router.beforeEach((to, from, next) => {
  loading = Loading.service();
  if (!to.matched.length) {
    next('/sign');
    return;
  }
  const login = store.state.user.userInfo.login;
  if (to.path.match(/^\/sign/) || login) {
    next();
    return;
  }
  var sessionId = sessionStorage.getItem('username');
  if (!sessionId) {
    next('/sign');
  } else {
    // 根据 sessionId 查询用户登录信息
    // store.dispatch('querySession', { sessionId, next });
    next();
  }
});

// 更新面包屑
router.afterEach((to, from) => {
  setTimeout(() => {
    loading.close();
  }, 0);
  const breadCrumb = [];
  for (let r of to.matched) {
    if (r.meta.name) {
      breadCrumb.push({
        name: r.meta.name,
        to: r
      });
    }
  }
  store.commit(types.SET_BREADCRUMB, breadCrumb);
});

export default router;
