<script src="../lib/CanvasChart.ts"></script>
<template>
  <vue-draggable-resizable
    class="chartContainer"
    :style="{
      left: model.coords.x + 'px',
      top: model.coords.y + 'px',
      width: model.dimensions.w + 'px',
      height: model.dimensions.h + 'px'
    }"
    :handles="['br']"
    :grid="[model.gridStepX, model.gridStepY]"
    @dragging="onDrag"
    @resizing="onResize"
    :resizable="resizable"
  >
    <div class="drag-handle">
      {{ id }}
    </div>
    <!-- grid and graphs -->
    <canvas
      class="image_canvas"
      ref="image_canvas"
      :width="model.dimensions.w"
      :height="model.dimensions.h"
      :style="{
        width: model.dimensions.w + 'px',
        height: model.dimensions.h + 'px'
      }"
    >
    </canvas>

    <div class="tooltip-container"></div>

    <!-- overlay hints -->
    <canvas
      class="image_canvas_overlay"
      ref="image_canvas_overlay"
      :width="model.dimensions.w"
      :height="model.dimensions.h"
      v-bind:style="{
        width: model.dimensions.w + 'px',
        height: model.dimensions.h + 'px'
      }"
    >
    </canvas>

    <!-- legends (small color bar and title (one or multiple legends) -->
    <div class="legend-container"></div>
  </vue-draggable-resizable>
</template>

<script lang="ts">
import Component from "@/lib/ClassComponentsHooks";
import { Watch, Model, Prop, Vue } from "vue-property-decorator";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import ChartConnector from "@/lib/ChartConnector";
import ChartModelInterface from "@/interfaces/ChartModelInterface";
import AppEvents from "@/lib/AppEvents";
import Generator from "@/lib/Generator";
import { Moment } from "moment";

Vue.component("vue-draggable-resizable", VueDraggableResizable);

@Component
export default class ChartCanvas extends Vue {
  public name = "demo-chart-canvas";
  public id = "demoChartCanvas";

  protected resizable = false;
  protected _container!: HTMLElement;
  protected _datasets!: Array<any>;
  protected _labels!: Array<string>;
  protected utcTime = false;
  public _chart!: any;
  protected chartGlobals!: any;
  protected _colors!: Array<string>;
  protected _suggestedMax = 1;
  protected _chartGlobalOptions: any;
  protected _moments!: Array<Moment>;
  @Prop() protected apiUrl!: string;
  @Prop() protected model!: ChartModelInterface;
  @Watch("model", { immediate: true, deep: true })
  onModelChanged(val: ChartModelInterface, oldVal: ChartModelInterface) {
    console.log("Model changed");
    console.log(oldVal);
    console.log(val);
  }

  /**
   * Define event listeners
   */
  created() {
    this.id += "_" + this.model.idx;
  }

  mounted() {
    // @ts-ignore
    this.$refs.image_canvas_overlay.style.display = "none";
  }

  /**
   * Set chart data
   */
  public setChartData() {
    // @ts-ignore
    const moment = this.$moment;

    this._datasets = [];
    this._labels = [];
    this._moments = [];
    this._colors = ["#687EF0", "#B26DE9", "#64C542"];

    for (let i = 0; i < Object.keys(Generator.staticData[0].metric).length; i++) {
      const _labels = this._labels;
      const _moments = this._moments;
      let _data: Array<any> = [];
      let _bubbleData: Array<any> = [];

      // @ts-ignore
      const values = this.model.chartData[i].values;

      values.forEach((v: any, idx: number) => {
        _data.push(parseFloat(v[1]));
        _bubbleData.push(this._getBubbleY(parseFloat(v[1]), i, idx));

        if (_labels.length < values.length) {
          _moments.push(moment(v[0] * 1000));
          _labels.push(moment(v[0] * 1000).format("HH:mm:ss"));
        }
      });

      this._datasets.push({
        moments: _moments,
        label: this.model.legends[i],
        backgroundColor: this._colors[i],
        borderWidth: 1,
        borderColor: "#22242C",
        data: _bubbleData,
        type: "bubble",
        hoverRadius: 0,
        radius: 4.5,
        pointStyle: "circle",
        // strokeColor: "rgba(240, 242, 244, 0.1)"б
        options: {
          title: {
            display: false
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  display: false
                }
              }
            ]
          }
        }
      });

      this._datasets.push({
        moments: _moments,
        label: this.model.legends[i],
        backgroundColor: this._colors[i],
        borderWidth: 0,
        barThickness: 7,
        maxBarThickness: 7,
        data: _data,
        type: "bar",
        options: {
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  display: false
                }
              }
            ]
          }
        }
      });
    }

    this._setMaxDataValue();
  }

  /**
   * Initialize chart
   */
  public createChart() {
    this._chart = new ChartConnector({
      // @ts-ignore
      ctx: this.$refs.image_canvas.getContext("2d"),
      lib: "chartjs",
      data: {
        labels: this._labels,
        datasets: this._datasets
      },
      options: {
        layout: {
          padding: {
            left: 31,
            right: 187,
            top: 40,
            bottom: 42
          }
        },
        responsive: true,
        legend: {
          display: false,
          position: "right",
          align: "start",
          labels: {
            boxWidth: 16,
            fontSize: 13,
            fontStyle: "normal",
            padding: 4,
            onClick() {
              return;
            }
          }
        },
        title: {
          display: false,
          text: "Demo Chart",
          fontSize: 15,
          fontColor: "#CACED1",
          padding: 12,
          lineHeight: 1.6
        },
        tooltips: {
          enabled: false,
          mode: "index",
          intersect: true,
          custom: this._customTooltips
        },
        scales: {
          xAxes: [
            {
              ticks: {
                maxRotation: 0,
                minRotation: 0,
                padding: 10,
                fontStyle: "normal",
                fontColor: "rgba(178, 185, 192, 0.6)"
              },
              gridLines: {
                zeroLineBorderDash: [],
                // drawBorder: true,
                tickMarkLength: 0,
                display: true,
                color: "rgba(240, 242, 244, 0.1)",
                borderDash: [3, 3]
              },
              stacked: true
            }
          ],
          yAxes: [
            {
              ticks: {
                padding: 10,
                fontSize: 13,
                fontStyle: "normal",
                fontColor: "rgba(178, 185, 192, 0.6)",
                min: 0,
                max: this._suggestedMax
              },
              gridLines: {
                // drawBorder: true,
                zeroLineBorderDash: [],
                tickMarkLength: 0,
                display: true,
                color: "rgba(240, 242, 244, 0.1)",
                borderDash: [3, 3]
              },
              stacked: true
            }
          ]
        },
        legendCallback(chart: Chart) {
          let itemsHtml: Array<string> = [];
          // @ts-ignore
          chart.config.data.datasets.forEach((ds: any, idx: number) => {
            if (idx % 2 == 0) {
              itemsHtml.push(`<div class="item">
        <div class="ds-legend" style="background: ${ds.backgroundColor}"></div>
        <div class="text">${ds.label}</div></div>`);
            }
          });

          return `${itemsHtml.join("\n")}`;
        }
      }
    }).connector;

    const legendContainer = this.$el.getElementsByClassName(
      "legend-container"
    )[0];
    if (legendContainer) {
      legendContainer.innerHTML = this._chart._chart.generateLegend();
    }
  }

  /**
   * Set maximal value for chart Y axis
   */
  protected _setMaxDataValue() {
    let max: Array<number> = [];

    this._datasets.forEach((ds: any) => {
      max.push(
        ds.data.reduce((acc: any, curr: any) => {
          return Math.max(acc, curr);
        })
      );
    });

    const r = max.reduce((acc: any, curr, any) => {
      return Math.max(acc, curr);
    });

    this._suggestedMax = Math.ceil(r);
  }

  /**
   * Redraw component
   */
  public update(model: any) {
    this.model = model;
    this.setChartData();
    this._chart._chart.data.datasets = this._datasets;
    this._chart._chart.data.labels = this._labels;
    this._chart._chart.config.options.scales.yAxes[0].ticks.max = this._suggestedMax;
    this._chart._chart.update();
  }

  /**
   * Get Y of bubble point
   */
  protected _getBubbleY(barY: number, datasetIdx: number, valIdx: number) {
    if (datasetIdx > 0) {
      let newBarY = 0;
      let dsIdx = 0;

      while (dsIdx <= datasetIdx) {
        newBarY = barY + parseFloat(this._datasets[dsIdx].data[valIdx]);
        dsIdx++;
      }

      return newBarY;
    } else {
      return barY;
    }
  }

  /**
   * Get chart position
   */
  get position() {
    return this.model.coords;
  }

  /**
   * Set chart position
   */
  set position(coords: any) {
    this.model.coords = coords;
  }

  /**
   * Get chart dimensions
   */
  get dimensions() {
    return Object.assign(
      {},
      this.$store.state.charts[this.model.idx].dimensions
    );
  }

  /**
   * Set chart dimensions
   */
  set dimensions(params: any) {
    this.$store.state.charts[this.model.idx].dimensions.w = params.w;
    this.$store.state.charts[this.model.idx].dimensions.h = params.h;
  }

  /**
   * @class TestChart
   * @param {Number} x
   * @param {Number} y
   */
  onDrag(x: number, y: number) {
    this.model.coords = { x: x, y: y };
  }

  /**
   * @class TestChart
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   */
  onResize(x: number, y: number, width: number, height: number) {
    console.log(x, y, width, height);

    this.model.coords = { x: x, y: y };
    this.model.dimensions = { w: width, h: height };
  }

  /**
   *
   * @param el
   */
  set context(el: any) {
    this._container = el;
  }

  get context() {
    return this._container;
  }

  get legends() {
    return [];
  }

  destroyed() {
    this.$el.remove();
  }

  protected _customTooltips(tooltip: any) {
    const posX = this._chart._chart.canvas.offsetLeft;
    // @ts-ignore
    const tooltipEl = this.$el.getElementsByClassName("tooltip-container")[0];
    // @ts-ignore
    tooltipEl.style.display = "block";

    tooltipEl.addEventListener("mouseenter", () => {
      // @ts-ignore
      tooltipEl.style.display = "none";
    });

    if (!tooltip || !tooltip.opacity) {
      return;
    }

    if (tooltip.dataPoints.length > 0) {
      const itemsHtml: Array<string> = [];
      const datasets = this._datasets;
      const moments = this._moments;

      tooltip.dataPoints.forEach((dataPoint: any, idx: number) => {
        if (idx % 2 === 0) {
          itemsHtml.push(`<div class="item"><div class="ds-legend"
style="background: ${tooltip.labelColors[idx].backgroundColor}"></div>
        <div class="text">${datasets[idx].label}</div></div>`);
        }

        // @ts-ignore
        tooltipEl.style.top = "25rem";
        // @ts-ignore
        tooltipEl.style.left = posX + dataPoint.x + "px";
        // @ts-ignore
        tooltipEl.style.display = "block";

        tooltipEl.innerHTML = `<div class="tooltip-head">${moments[dataPoint.index].format("HH:mm:ss, DD.MM.YYYY")}</div>
        <div class="tooltip-body">${itemsHtml.join("\n")}</div>
        <div class="tooltip-footer" style="display: none"></div>`;
      });
    }
  }
}
</script>

<style lang="scss">
.chartContainer {
  border: solid 1px gray;
  border-radius: 4px;
  display: flex;
  position: absolute;
  background: #22242c;
}

.image_canvas {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  font-family: Roboto, Arial, Helvetica, sans-serif;
  cursor: url("../assets/Rectangle387.png") 7 7, crosshair;

  * {
    font-family: Roboto, Arial, Helvetica, sans-serif;
  }
}

.legend-container,
.tooltip-container {
  width: 18.7rem;
  position: absolute;
  right: 0;
  height: 100%;
  overflow: hidden;
  top: 4rem;
  text-transform: capitalize;

  * {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  .item {
    left: 3.5rem;
    position: relative;
    display: flex;
    align-items: center;
    font-size: 1.3rem;
  }

  .ds-legend {
    width: 1.6rem;
    height: 0.4rem;
    border-radius: 0.2rem;
    background: white;
  }

  .text {
    white-space: nowrap;
    margin-left: 1rem;
    line-height: 2rem;
  }
}

.drag-handle {
  text-align: center;
  cursor: move;
  position: absolute;
  font-size: 1.5rem;
  line-height: 1.6rem;
  padding: 1.2rem 0;
  width: 100%;
}

.image_canvas {
  position: absolute;
}

.image_canvas_overlay {
  position: absolute;
}

.tooltip-container {
  display: none;
  position: relative;
  height: fit-content;
  background: #22242c;
  border: 0.1rem solid rgba(240, 242, 244, 0.1);
  box-sizing: border-box;
  box-shadow: 0 0.7rem 1.5rem rgba(21, 24, 33, 0.7);
  border-radius: 0.4rem;
  min-width: 19.8rem;
  min-height: 10.8rem;
  margin-left: 0.7rem;

  * {
    font-size: 1.3rem;
  }

  > div {
    margin-left: 1.6rem;
    margin-right: 1.3rem;
  }

  .tooltip-bottom {
    padding-top: 0.8rem;
  }

  .tooltip-head{
    line-height: 2rem;
    padding: 0.9rem 1.3rem 0.7rem 1.6rem;
    background: rgba(178, 185, 192, 0.07);
    margin-left: 0;
    margin-right: 0;
  }

  .tooltip-body {
    padding-top: .8rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: nowrap;

    .item{
      position: unset;
    }
  }
}
</style>
