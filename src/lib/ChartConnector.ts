// @ts-check
/**
 * @author Anton Repin <lehcode@gmail.com>
 */
import CanvasChart from "@/lib/CanvasChart";
import ChartJSChart from "@/lib/ChartJSChart";

export default class ChartConnector {
  protected _connector!: any;
  protected _overlay!: any;

  /**
   * @class ChartConnector
   * @param {Object} props
   */
  constructor(props: any) {
    switch (props.lib) {
      case "chartjs":
        this._connector = new ChartJSChart({
          context: props.ctx,
          data: props.data,
          options: props.options
        });
        break;
      default:
      case "html5":
        // this._connector = new CanvasChart(props.ctx, {
        //   data: props.data,
        //   options: props.options
        // });
        break;
    }
  }

  get connector() {
    return this._connector;
  }
}
