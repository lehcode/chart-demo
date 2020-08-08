// @ts-check
import ChartModelInterface from "@/interfaces/ChartModelInterface";

/**
 * @author Anton Repin <lehcode@gmail.com>
 */
export default class ChartDataModel implements ChartModelInterface {
  idx = 0;
  legends = ["legend_01", "legend_02", "legend_03"];
  xScale = [1, 2, 3, 4];
  yScale = [1, 2, 3, 4];
  gridStepX = 115;
  gridStepY = 60;
  coords = { x: 0, y: 0 };
  startUTC = 1596128655;
  endUTC = 1596128955;
  dimensions = { w: 642, h: 443 };
  // @ts-ignore
  chartData = [];
}
