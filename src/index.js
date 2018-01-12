import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import cx from 'classnames';
import { format } from 'd3-format';
import {
  ChartCanvas,
  Chart,
  axes,
  helper,
  tooltip,
  scale,
  series
} from 'cefc-stockcharts';
import styles from './style/index.less';

/**
 * @description 将纯数字转换为包含中文单位万或者亿的数量
 * @author CarltonXiang
 * @config config
 *  @param num  待格式化的数字
 *  @param isInteger  是否显示整数
 *  @param precision 小数点精度 3代表显示3位小数，2代表显示2位小数
 *  @param defaultValue 默认显示
 */
const unitFormat = (config) => {
  let value = '';
  let precision = 2; // 小数点精度，默认显示2位小数
  let isInteger = false; //是否是整数，不显示小数点
  let defaultValue = '--'; //默认显示
  let minUnitNum = 100000;
  const ONE_MILLION = 1000000;

  if (typeof config === 'object') {
    value = config.value;
    precision = config.precision || precision;
    isInteger = config.isInteger || isInteger;
    defaultValue = config.defaultValue || defaultValue;
    minUnitNum = config.minUnitNum || minUnitNum;
  } else {
    value = config;
  }

  let retNum = parseFloat(value);

  //若不是数字，返回默认数字
  if (isNaN(retNum)) {

    return defaultValue;
  }

  const YI = ONE_MILLION * 100;
  const WAN = ONE_MILLION / 100;

  const baseRate = retNum >= YI ? YI : (retNum >= minUnitNum ? WAN : 1);
  const integerName = retNum >= YI ? '亿' : (retNum >= minUnitNum ? '万' : '');

  retNum = retNum / baseRate;

  //数字1亿显示亿，大于百万显示万
  if (isInteger) {
    return `${Math.round(retNum)}${integerName}`;
  }

  const scale = Math.pow(10, parseInt(precision));
  retNum = isInteger ? Math.round(retNum) : parseFloat((Math.round(retNum * scale) / scale).toFixed(precision));

  return integerName ? `${retNum}${integerName}` : parseFloat(retNum);
}


/**
 * @description 格式化数字，根据数据精度，显示小数点的位数
 * @author CarltonXiang
 * @config
 *  @param value  待格式化的数字
 *  @param precision 小数点精度 3代表显示3位小数，2代表显示2位小数
 *  @param defaultValue 默认显示
 * @returns {string}
 */
const decimalFormat = (config, preci) => {
  let value = '';
  let precision = 2; // 小数点精度，默认显示2位小数
  let defaultValue = '--'; //默认显示

  if (typeof config === 'object') {
    value = config.value;
    precision = config.precision || precision;
    defaultValue = config.defaultValue || defaultValue;
  } else {
    value = config;
    precision = preci ? preci : precision;
  }

  let returnNum = parseFloat(value);

  //不是数字，返回默认显示
  if (isNaN(returnNum)) {

    return defaultValue;
  }

  const val = returnNum * Math.pow(10, precision);

  return (Math.round(val) / Math.pow(10, precision)).toFixed(precision);
};

function tooltipContent(ys, precision) {
  return ({ currentItem }) => {
    let { volume, avgPrice, lastPrice } = currentItem;
    let timeLineJudge = !avgPrice && !lastPrice && !volume;

    if (timeLineJudge) {
      return null;
    }

    return {
      x: '时间: ' + currentItem.x,
      y: (ys.map((each) => {
        return {
          label: each.value(currentItem) && each.label,
          value: each.value(currentItem) && decimalFormat({ value: Number(each.value(currentItem)), precision: precision })
        };
      })).concat([{
        label: '成交量',
        value: currentItem.volume && unitFormat({ value: currentItem.volume , precision: precision}) + '手'
      }]).filter((line) => {
        return line.value;
      })
    };
  };
}

class stockChartTimeline extends Component {
  getChartStyle = ({ data, isIndex, showGrid, lineTickValues, barTickValues, isHKStock, chartMargin, yExtents, height, width }) => {
    let gridHeight = height - chartMargin.top - chartMargin.bottom;
    let gridWidth = width - chartMargin.left - chartMargin.right;
    let lineYGrid = showGrid ? {
          innerTickSize: -1 * gridWidth,
          tickStrokeDasharray: 'Solid',
          tickStrokeOpacity: 1,
          tickStrokeWidth: 1,
          tickSize: 100,
          tickValues: lineTickValues
        } : {};
    let xGrid = showGrid ? {
          innerTickSize: -1 * gridHeight,
          tickStrokeDasharray: 'Solid',
          tickStrokeOpacity: 1,
          tickStrokeWidth: 1,
          tickSize: 100,
          tickValues: [parseInt(data.length / 2)],
        } : {};
    let barYGrid = showGrid ? {
          innerTickSize: -1 * gridWidth,
          tickStrokeDasharray: 'Solid',
          tickStrokeOpacity: 1,
          tickStrokeWidth: 1,
          tickSize: 100,
          tickValues: barTickValues
        } : {};
    let landscape = false;

    if (!isIndex && 1.5 * height <  width) { // 说明是非指数 横屏
      landscape = true;
    }
    let delta = (Number(yExtents[0]) - Number(yExtents[1])) * 0.01;
    const totalDotsNum = isHKStock ? 330 : 240;
    let xAxisLabel = isHKStock ? ['9:30', '12:00', '16:00'] : ['9:30', '11:30|13:00', '15:00'];

    return { lineYGrid, xGrid, barYGrid, totalDotsNum, landscape, xAxisLabel, delta };
  }

  render() {
    let { type, chartData, height, width, ratio, lineChartHeight, barChartHeight, chartMargin, showGrid, yExtents, backgroundColor, style, offset, lineTickValues, barTickValues, eventCoordinateReverse, isIndex, gridLabel, precision, isHKStock, isIOS } = this.props;
    const { yAxisLeft, yAxisRight, volumeMaxValue } = gridLabel;
    const xScaleProvider = scale.discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
    const { data, xAccessor, displayXAccessor } = xScaleProvider(chartData);
    let { lineYGrid, xGrid, barYGrid, totalDotsNum, landscape, xAxisLabel, delta } = this.getChartStyle({ data, isIndex, showGrid, backgroundColor, lineTickValues, barTickValues, isHKStock, chartMargin, yExtents, height, width });
    style.backgroundColor = backgroundColor;

    return (
      <div className="container_bg_ChatBkg" style={style} >
        <div className="realTimeOpenCloseTime">
          <span className={cx('fl_left', { index: isIndex }, { landscape: landscape })}>{xAxisLabel[0]}</span>
          <span className={cx('fl_middle', { index: isIndex }, { landscape: landscape }, { iOSLandscape: isIOS && landscape})}>{xAxisLabel[1]}</span>
          <span className={cx('fl_right', { index: isIndex }, { landscape: landscape })}>{xAxisLabel[2]}</span>
          <span className={cx('yAxisLeft_top', { index: isIndex }, { landscape: landscape })}>{yAxisLeft[2]}</span>
          <span className={cx('yAxisLeft_middle', { index: isIndex }, { landscape: landscape })}>{yAxisLeft[1]}</span>
          <span className={cx('yAxisLeft_bottom', { index: isIndex }, { landscape: landscape })}>{yAxisLeft[0]}</span>
          <span className={cx('yAxisLeft_bottom_volume', { index: isIndex }, { landscape: landscape })}>{volumeMaxValue}</span>
          <span className={cx('yAxisRight_top', { index: isIndex }, { landscape: landscape })}>{yAxisRight[1]}</span>
          <span className={cx('yAxisRight_bottom', { index: isIndex }, { landscape: landscape })}>{yAxisRight[0]}</span>
        </div>
        <ChartCanvas height={height} width={width} ratio={ratio} displayXAccessor={displayXAccessor} margin={chartMargin} type={type} seriesName="MSFT" data={data} xScale={scaleLinear()} xAccessor={xAccessor} xExtents={[totalDotsNum, 0]} zoomMultiplier={0} zIndex={0} xAxisZoom={() => {}} onSelect={this.onSelect} defaultFocus={false}  zoomEvent={false} clamp={false} eventCoordinateReverse={eventCoordinateReverse} panEvent mouseMoveEvent>
          <Chart id={1} yExtents={[Number(yExtents[0]) + delta, Number(yExtents[1]) - delta]} height={lineChartHeight} origin={(w, h) => [0, 0]}>
            <axes.XAxis axisAt="bottom" orient="bottom" ticks={1} zoomEnabled={false} showTickLabel={false} {...xGrid} />
            <axes.YAxis axisAt="right" orient="right" zoomEnabled={false} showTickLabel={false} {...lineYGrid} showDomain={false} />
            <series.LineSeries
                yAccessor={d => {
                  return d.avgPrice;
                }}
                stroke="rgba(255, 255, 0, 0.7)"
            />
            <series.AreaSeries
                yAccessor={d => {
                  return d.lastPrice;
                }}
                stroke="#96b9cf"
            />
            <tooltip.HoverTooltip
                yAccessor={d => d.avgPrice}
                tooltipContent={tooltipContent([
                  {
                    label: '均价',
                    value: d => d.avgPrice,
                    stroke: 'rgba(255, 255, 0, 0.7)'
                  },
                  {
                    label: '当前价',
                    value: d => d.lastPrice,
                    stroke: '#96b9cf'
                  }
                ], precision)}
                fontSize={12}
                offset={offset}
            />
          </Chart>
          <Chart id={2} yExtents={[d => d.volume]} height={barChartHeight} origin={(w, h) => [0, h - barChartHeight]}>
            <axes.YAxis axisAt="left" orient="left" ticks={1} tickFormat={format('.0s')} zoomEnabled={false} showTickLabel={false} {...barYGrid} showDomain={false} />
            <axes.XAxis axisAt="bottom" orient="bottom" zoomEnabled={false} showTickLabel={false} {...xGrid} showDomain={false} />
            <series.BarSeries
                yAccessor={d => {
                  return d.volume;
                }} fill={d => {
                  return d.volume ? d.volumeColor : '#393c43';
            }}
                offset={offset}
            />
          </Chart>
        </ChartCanvas>
      </div>)
  }
}

stockChartTimeline.propTypes = {
  chartData: PropTypes.array.isRequired,
  lineChartHeight: PropTypes.number,
  barChartHeight: PropTypes.number,
  lineTickValues: PropTypes.array,
  barTickValues: PropTypes.array,
  width: PropTypes.number,
  ratio: PropTypes.number,
  height: PropTypes.number,
  type: PropTypes.oneOf(['svg', 'hybrid']),
  chartMargin: PropTypes.shape({
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    bottom: PropTypes.number
  }),
  showGrid: PropTypes.bool,
  yExtents: PropTypes.array,
  isIndex: PropTypes.bool,
  gridLabel: PropTypes.shape({
    yAxisLeft: PropTypes.array,
    yAxisRight: PropTypes.array,
    volumeMaxValue: PropTypes.number,
  }),
  backgroundColor: PropTypes.string,
  style: PropTypes.object,
  offset: PropTypes.number,
  eventCoordinateReverse: PropTypes.bool,
  precision: PropTypes.number,
  isHKStock: PropTypes.bool,
  isIOS: PropTypes.bool,
};

stockChartTimeline.defaultProps = {
  type: 'hybrid',
  lineChartHeight: 180,
  isIndex: false,
  barChartHeight: 60,
  offset: 3,
  lineTickValues: [],
  eventCoordinateReverse: false,
  barTickValues: [],
  gridLabel: PropTypes.shape({
    yAxisLeft: [],
    yAxisRight: [],
    volumeMaxValue: 0,
  }),
  chartMargin: {
    left: 5, right: 5, top: 10, bottom: 0
  },
  showGrid: true,
  backgroundColor: '#393c43',
  style: {},
  precision: 2,
  isHKStock: false,
  isIOS: false,
};

export default helper.fitDimensions(stockChartTimeline);
