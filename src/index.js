import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import { format } from 'd3-format';
import {
  ChartCanvas,
  Chart,
  axes,
  helper,
  tooltip,
  scale,
  series
} from 'cefc-reactstockcharts';
import styles from './style/index.less';
const numberFormat = format('.2f');

function tooltipContent(ys) {
  return ({ currentItem }) => {
    let { volume, avgPrice, lastPrice } = currentItem;
    let timeLineJudge = !avgPrice && !lastPrice && !volume;

    if (timeLineJudge) {
      return null;
    }

    return {
      x: '时间: ' + currentItem.x,
      y: (ys.map(function (each) {
        return {
          label: each.label,
          value: each.value(currentItem),
        };
      })).concat([{
        label: '成交量',
        value: currentItem.volume && numberFormat(currentItem.volume)
      }]).filter(function (line) {
        return line.value;
      })
    };
  };
}

class stockChartTimeline extends Component {

  render() {
    let { type, chartData, height, width, ratio, lineChartHeight, barChartHeight, chartMargin, showGrid, yExtents, backgroundColor, style, offset, lineTickValues, barTickValues } = this.props;
    const xScaleProvider = scale.discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
    const { data, xAccessor, displayXAccessor } = xScaleProvider(chartData);
    let gridHeight = height - chartMargin.top - chartMargin.bottom;
    let gridWidth = width - chartMargin.left - chartMargin.right;
    let lineYGrid = showGrid ? {
      innerTickSize: -1 * gridWidth,
      tickStrokeDasharray: 'Solid',
      tickStrokeOpacity: 1,
      tickStrokeWidth: 1,
      tickSize: 100,
      tickValues: [lineTickValues]
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
          tickValues: [barTickValues]
        } : {};
    style.backgroundColor = backgroundColor;

    return (
      <div className="container_bg_ChatBkg" style={style} >
        <ChartCanvas height={height} width={width} ratio={ratio} displayXAccessor={displayXAccessor} margin={chartMargin} type={type} seriesName="MSFT" data={data} xScale={scaleLinear()} xAccessor={xAccessor} xExtents={[239, 0]} zoomMultiplier={0} zIndex={0} xAxisZoom={() => {}} onSelect={this.onSelect} defaultFocus={false}  zoomEvent={false} clamp={false} panEvent mouseMoveEvent>
          <Chart id={1} yExtents={yExtents} height={lineChartHeight} origin={(w, h) => [0, 0]}>
            <axes.XAxis axisAt="bottom" orient="bottom" ticks={1} zoomEnabled={false} showTickLabel={false} {...xGrid} />
            <axes.YAxis axisAt="right" orient="right" zoomEnabled={false} showTickLabel={false} {...lineYGrid} showDomain={false} />
            <series.LineSeries
                yAccessor={d => {
                  return d.avgPrice;
                }} stroke="rgba(255, 255, 0, 0.7)"
            />
            <series.LineSeries
                yAccessor={d => {
                  return d.lastPrice;
                }} stroke="#fff"
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
                ])} fontSize={15}
                offset={offset}
            />
          </Chart>
          <Chart id={2} yExtents={[d => d.volume]} height={barChartHeight} origin={(w, h) => [0, h - 40]}>
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
  backgroundColor: PropTypes.string,
  style: PropTypes.object,
  offset: PropTypes.number,
};

stockChartTimeline.defaultProps = {
  type: 'hybrid',
  lineChartHeight: 180,
  barChartHeight: 40,
  offset: 3,
  lineTickValues: [],
  barTickValues: [],
  chartMargin: {
    left: 5, right: 5, top: 10, bottom: 0
  },
  showGrid: true,
  backgroundColor: '#393c43',
  style: {}
};

export default helper.fitDimensions(stockChartTimeline);
