// @ts-check
/**
 * @author Anton Repin <lehcode@gmail.com>
 */
export default class CanvasChart {
  protected _context!: HTMLElement;
  protected _data!: Array<any>;

  /**
   * @class CanvasChart
   * @param ctx
   * @param options
   */
  constructor(ctx: HTMLElement, options: any) {
    this._context = ctx;
    this._data = options.data;
  }

  drawBar() {
    const max = this._getDatasetMaxValue();
  }

  protected _getDatasetMaxValue() {

  }
}
