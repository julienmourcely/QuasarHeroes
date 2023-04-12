export default {
  namespaced: true,
  state: {
    currentPassword: null,
  },
  mutations: {
    setCurrentPassword(state, password) {
      state.currentPassword = password;
    },
  },
  actions: {
    updatePassword({ commit }, password) {
      commit("setCurrentPassword", password);
    },
  },
};
