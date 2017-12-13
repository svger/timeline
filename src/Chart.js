import React from "react";
import { ChartCanvas, Chart } from "cefc-reactstockcharts";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import {
  indicator,
  axes,
  helper,
  utils,
  tooltip,
  scale,
  series
} from "cefc-reactstockcharts";

const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format(".2f");

function tooltipContent(ys) {
  return ({ currentItem, xAccessor }) => {
    let { volume, avgPrice, lastPrice } = currentItem;
    let timeLineJudge = !avgPrice && !lastPrice && !volume;

    if (timeLineJudge) {
      return null;
    }

    return {
      x: "时间:" + currentItem.x,
      y: [
        {
          label: "成交量",
          value: currentItem.volume && numberFormat(currentItem.volume)
        }
      ]
        .concat(
          ys.map(each => ({
            label: each.label,
            value: each.value(currentItem),
            stroke: each.stroke
          }))
        )
        .filter(line => line.value)
    };
  };
}

const keyValues = ["high", "low"];

class CandleStickChartWithHoverTooltip extends React.Component {
  removeRandomValues(data) {
    return data.map(item => {
      const newItem = { ...item };
      const numberOfDeletion = Math.floor(Math.random() * keyValues.length) + 1;
      for (let i = 0; i < numberOfDeletion; i += 1) {
        const randomKey =
          keyValues[Math.floor(Math.random() * keyValues.length)];
        newItem[randomKey] = undefined;
      }
      return newItem;
    });
  }

  render() {
    let {
      type,
      data: initialData,
      width,
      ratio,
      yExtents,
      height
    } = this.props;
    const ema20 = indicator.ema()
      .id(0)
      .options({ windowSize: 1 })
      .merge((d, c) => {
        d.ema20 = c;
      })
      .accessor(d => d.ema20);

    const margin = { left: 5, right: 5, top: 10, bottom: 0 };
    const calculatedData = ema20(initialData);
    const xScaleProvider = scale.discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      calculatedData
    );

    const start = xAccessor(utils.last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];

    return <div>
        <ChartCanvas height={height} width={width} ratio={ratio} margin={margin} type={type} seriesName="MSFT" data={data} xScale={scaleLinear()} xAccessor={xAccessor} xExtents={[239, 0]} zoomMultiplier={0} xAxisZoom={() => {}} defaultFocus={false} panEvent={true} zoomEvent={false} mouseMoveEvent={true} clamp={false} zIndex={0} onSelect={this.onSelect}>
          <Chart id={1} yExtents={yExtents} height={180} origin={(w, h) => [0, 0]}>
            <axes.XAxis axisAt="bottom" orient="bottom" ticks={4} zoomEnabled={false} showTicks={false} showDomain={false} />
            <axes.YAxis axisAt="right" orient="right" ticks={5} zoomEnabled={false} showTicks={false} showDomain={false} />

            <series.LineSeries yAccessor={d => {
                return d.avgPrice;
              }} stroke="rgba(255, 255, 0, 0.7)" />
            <series.LineSeries yAccessor={d => {
                return d.lastPrice;
              }} stroke="#fff" />

            <tooltip.HoverTooltip yAccessor={d => d.avgPrice} tooltipContent={tooltipContent(
                [
                  {
                    label: `均价`,
                    value: d => d.avgPrice,
                    stroke: "rgba(255, 255, 0, 0.7)"
                  },
                  {
                    label: `当前价`,
                    value: d => d.lastPrice,
                    stroke: "#96b9cf"
                  }
                ]
              )} fontSize={15} />
          </Chart>
          <Chart id={2} yExtents={[d => d.volume]} height={40} origin={(w, h) => [0, h - 40]}>
            <axes.YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")} zoomEnabled={false} showTicks={false} showDomain={false} />

            <series.BarSeries yAccessor={d => {
                return d.volume;
              }} fill={d => {
                return d.volume ? d.volumeColor : "#393c43";
              }} />
          </Chart>
        </ChartCanvas>
      </div>;
  }
}

CandleStickChartWithHoverTooltip.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChartWithHoverTooltip.defaultProps = {
  type: "svg"
};
CandleStickChartWithHoverTooltip = helper.fitDimensions(
  CandleStickChartWithHoverTooltip
);

export default CandleStickChartWithHoverTooltip;