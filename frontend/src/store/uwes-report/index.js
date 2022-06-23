import useJwt from '@/auth/jwt/useJwt';

export default {
  namespaced: true,
  state: { uwesSuurveyData: [], uwesSuurveyApiStatus: 'idle' },
  getters: {},
  mutations: {
    setUwesSurveyData: (state, workflows) => (state.uwesSuurveyData = workflows),
    setUwesSurveyApiStatus: (state, status) => (state.uwesSuurveyApiStatus = status),
  },
  actions: {
    getUwesSurveyData({ commit }) {
      commit('setUwesSurveyApiStatus', 'pending');
      return useJwt.getUwesSurveyData().then((data) => {
        commit('setUwesSurveyApiStatus', 'fulfilled');
        commit('setUwesSurveyData', data);
      });
    },
  },
};
