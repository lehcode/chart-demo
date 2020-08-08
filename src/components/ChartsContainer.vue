<template>
  <div>
    <div class="select">
      <select v-model="amount" @change="updateChildren">
        <option disabled value="">Charts amount</option>
        <option v-for="n in maxAmount" v-bind:value="n" v-bind:key="n">{{
          n
        }}</option>
      </select>
      <div>
        <input
          type="checkbox"
          v-model="randomize"
          v-on:input="toggleRandomize"
          id="randomizeSwitch"
        />
        <label for="randomizeSwitch">Random data: {{ randomize }}</label>
      </div>
    </div>
    <div id="ChartsContainer" ref="charts_container"></div>
  </div>
</template>

<script>
import ChartCanvas from "./ChartCanvas";
import Vue from "vue";
import AppEvents from "@/lib/AppEvents";

Vue.component("chart-canvas", ChartCanvas);

export default {
  data() {
    return {
      amount: 3,
      maxAmount: 9,
      randomize: true
    };
  },
  mounted() {
    this.charts();
  },
  methods: {
    toggleRandomize() {
      this.randomize = !this.randomize;
      this.charts();
    },
    charts() {
      let updating = false;

      if (this.$children.length) {
        updating = true;
      }

      for (let j = 0; j < this.amount; j++) {
        this.$store
          .dispatch("fakeApiCall", {
            randomize: this.randomize,
            amt: this.amount
          })
          .then(() => {
            const CanvasClass = Vue.extend(ChartCanvas);

            let i = 0;
            if (j > 0) i = j - 1;

            this.$store.state.charts[j] = Object.assign(
              {},
              this.$store.state.charts[i]
            );
            this.$store.state.charts[j].idx = j;

            const xPos = this.$store.state.charts[i].coords.x + 50;
            const yPos = this.$store.state.charts[i].coords.y + 50;

            this.$store.state.charts[j].coords = { x: xPos, y: yPos };

            this.$store.state.charts[j].legends = Object.values(
              this.$store.state.charts[i].chartData[i].metric
            );

            const chartModel = Object.assign({}, this.$store.state.charts[j]);

            if (updating) {
              this.$children[j].update(chartModel);
            } else {
              debugger;
              const chartCanvas = new CanvasClass({
                propsData: {
                  model: chartModel
                }
              });

              this.$children.push(chartCanvas);
              chartCanvas.$mount();
              chartCanvas.setChartData();
              chartCanvas.createChart();
              this.$refs.charts_container.appendChild(chartCanvas.$el);
            }

            i++;

            if (j === this.amount - 1) {
              this.updating = false;
            }
          });
      }
    },
    updateChildren(...args) {
      this.$children.forEach((canvas) => {
        canvas.$destroy();
      });
      this.$children = [];

      this.charts();
    }
  }
};
</script>

<style scoped lang="scss">
#ChartsContainer {
  display: flex;
  justify-content: space-around;
  align-content: flex-start;
  overflow: hidden;
}

.select {
  display: flex;
  justify-content: center;
}
</style>
