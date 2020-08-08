// @ts-check
/**
 * @author Anton Repin <lehcode@gmail.com>
 */
export default interface ChartModelInterface
  extends ChartDimensionsInterface,
    ChartDataInterface,
    ChartPositionInterface {
  idx: number;
  legends: Array<string>;
  startUTC: number;
  endUTC: number;
  gridStepX: number;
  gridStepY: number;
  xScale: Array<number>;
  yScale: Array<number>;
}

export class ChartDataInterface {
  chartData = [];
}

export class ChartDimensionsInterface {
  dimensions = {
    w: 0,
    h: 0
  };
}

export class ChartPositionInterface {
  coords = {
    x: 0,
    y: 0
  };
}
