// @ts-check
/**
 * @author Anton Repin <lehcode@gmail.com>
 */
import Chart from "chart.js";

export default class ChartJSChart {
  protected _chart: Chart;

  constructor(props: any) {
    this._chart = new Chart( props.context, {
      type: "bar",
      data: props.data,
      options: props.options
    });
  }
}