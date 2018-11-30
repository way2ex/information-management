import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import * as types from './mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    breadCrumb: []
  },
  mutations: {
    [types.SET_BREADCRUMB] (state, payload) {
      state.breadCrumb = payload;
    }
  },
  modules: {
    user
  }
});
