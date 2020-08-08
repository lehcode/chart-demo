import Vue from "vue";
import Vuex from "vuex";
import Generator from "@/lib/Generator";
import ChartDataModel from "@/components/models/ChartDataModel";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    charts: [new ChartDataModel()]
  },
  mutations: {
    getChartData(state, options: any) {
      console.log(`store::getChartData()`);

      for (let i = 0; i < options.amt; i++) {
        if (state.charts[i]) {
          const data = new Generator().data({
            randomize: options.randomize,
            startUTC: options.startTime || state.charts[i].startUTC,
            m: 31,
            amt: options.amt
          });

          state.charts[i].chartData = data;
          state.charts[i].legends = Object.values(data[i].metric);
        }
      }
    }
  },
  actions: {
    fakeApiCall({ commit }, options) {
      console.log(`store::fakeApiCall()`);

      return new Promise((resolve: any) => {
        setTimeout(() => {
          commit("getChartData", options);
          resolve();
        }, 1000);
      });
    }
  },
  modules: {}
});

export default store;
