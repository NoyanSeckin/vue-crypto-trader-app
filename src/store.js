import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    crypto: {},
    user: null,
    clickedCrypto: null,
    sum: null,
    prices: {},
    isSuccessAlert: false,
  },
  getters: {
    dynamicBalance: (state) => {
      return state.user.cryptoAssets;
    },
  },
  mutations: {
    getCrypto(state, payload) {
      state.crypto = payload;
    },
    getUser(state, payload) {
      state.user = payload;
    },
    getClickedCrypto(state, payload) {
      state.clickedCrypto = payload;
    },
    getBalance(state, payload) {
      state.sum = payload;
    },

    getPrices(state, payload) {
      state.prices = payload;
    },
    isSuccessAlert(state, payload) {
      state.isSuccessAlert = payload;
    },
  },
});
