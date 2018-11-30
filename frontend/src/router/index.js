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
        // {
        //   path: 'im',
        //   component: IM,
        //   meta: { name: '接口管理' },
        //   children: [
        //     {
        //       path: '',
        //       redirect: 'list'
        //     },
        //     {
        //       path: 'list',
        //       component: IM_LIST,
        //       name: 'im'
        //     },
        //     {
        //       path: 'create',
        //       component: IM_CREATE,
        //       name: 'im-create',
        //       meta: { name: '新建接口' }
        //     }
        //   ]
        // },
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
