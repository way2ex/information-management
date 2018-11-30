import * as types from '../mutation-types';
import ajax from '@/common/ajax';
import { Message } from 'element-ui';
import router from '@/router';

const state = {
  userInfo: {
    loading: false,
    login: false,
    nickname: '',
    username: ''
  }
};

const mutations = {
  [types.SET_USER_INFO] (state, payload) {
    state.userInfo = payload;
  }
};

const actions = {
  // sign in
  login ({ commit, state: { userInfo } }, payload) {
    commit(types.SET_USER_INFO, { ...userInfo, loading: true });
    ajax.post('/login', payload)
      .then((data) => {
        commit(types.SET_USER_INFO, { ...userInfo, ...data, loading: false, login: true });
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('nickname', data.nickname);
        Message.success({ message: '登陆成功！' });
        router.push({ path: '/' });
      })
      .catch(() => {
        commit(types.SET_USER_INFO, { ...userInfo, loading: false });
      });
  }
};

export default {
  state,
  mutations,
  actions
};
