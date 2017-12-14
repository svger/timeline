'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Scale = require('d3-scale');

var _d3Format = require('d3-format');

var _cefcReactstockcharts = require('cefc-reactstockcharts');

var _index = require('./style/index.less');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var numberFormat = (0, _d3Format.format)('.2f');

function tooltipContent(ys) {
  return function (_ref) {
    var currentItem = _ref.currentItem,
        xAccessor = _ref.xAccessor;
    var volume = currentItem.volume,
        avgPrice = currentItem.avgPrice,
        lastPrice = currentItem.lastPrice;

    var timeLineJudge = !avgPrice && !lastPrice && !volume;

    if (timeLineJudge) {
      return null;
    }

    return {
      x: '时间:' + currentItem.x,
      y: [{
        label: '成交量',
        value: currentItem.volume && numberFormat(currentItem.volume)
      }].concat(ys.map(function (each) {
        return {
          label: each.label,
          value: each.value(currentItem),
          stroke: each.stroke
        };
      })).filter(function (line) {
        return line.value;
      })
    };
  };
}

var stockChartTimeline = function (_Component) {
  _inherits(stockChartTimeline, _Component);

  function stockChartTimeline() {
    _classCallCheck(this, stockChartTimeline);

    return _possibleConstructorReturn(this, (stockChartTimeline.__proto__ || Object.getPrototypeOf(stockChartTimeline)).apply(this, arguments));
  }

  _createClass(stockChartTimeline, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          type = _props.type,
          chartData = _props.chartData,
          height = _props.height,
          width = _props.width,
          ratio = _props.ratio,
          lineChartHeight = _props.lineChartHeight,
          barChartHeight = _props.barChartHeight;

      var margin = { left: 5, right: 5, top: 10, bottom: 0 };
      var xScaleProvider = _cefcReactstockcharts.scale.discontinuousTimeScaleProvider.inputDateAccessor(function (d) {
        return d.date;
      });

      var _xScaleProvider = xScaleProvider(chartData),
          data = _xScaleProvider.data,
          xAccessor = _xScaleProvider.xAccessor,
          displayXAccessor = _xScaleProvider.displayXAccessor;

      return _react2.default.createElement(
        'div',
        { className: 'container_bg_ChatBkg' },
        _react2.default.createElement(
          _cefcReactstockcharts.ChartCanvas,
          { height: height, width: width, ratio: ratio, displayXAccessor: displayXAccessor, margin: margin, type: type, seriesName: 'MSFT', data: data, xScale: (0, _d3Scale.scaleLinear)(), xAccessor: xAccessor, xExtents: [239, 0], zoomMultiplier: 0, zIndex: 0, xAxisZoom: function xAxisZoom() {}, onSelect: this.onSelect, defaultFocus: false, zoomEvent: false, clamp: false, panEvent: true, mouseMoveEvent: true },
          _react2.default.createElement(
            _cefcReactstockcharts.Chart,
            { id: 1, yExtents: [function (d) {
                return [d.avgPrice, d.lastPrice];
              }], height: lineChartHeight, origin: function origin(w, h) {
                return [0, 0];
              } },
            _react2.default.createElement(_cefcReactstockcharts.axes.XAxis, { axisAt: 'bottom', orient: 'bottom', ticks: 4, zoomEnabled: false, showTicks: false, showDomain: false }),
            _react2.default.createElement(_cefcReactstockcharts.axes.YAxis, { axisAt: 'right', orient: 'right', ticks: 5, zoomEnabled: false, showTicks: false, showDomain: false }),
            _react2.default.createElement(_cefcReactstockcharts.series.LineSeries, {
              yAccessor: function yAccessor(d) {
                return d.avgPrice;
              }, stroke: 'rgba(255, 255, 0, 0.7)'
            }),
            _react2.default.createElement(_cefcReactstockcharts.series.LineSeries, {
              yAccessor: function yAccessor(d) {
                return d.lastPrice;
              }, stroke: '#fff'
            }),
            _react2.default.createElement(_cefcReactstockcharts.tooltip.HoverTooltip, {
              yAccessor: function yAccessor(d) {
                return d.avgPrice;
              },
              tooltipContent: tooltipContent([{
                label: '均价',
                value: function value(d) {
                  return d.avgPrice;
                },
                stroke: 'rgba(255, 255, 0, 0.7)'
              }, {
                label: '当前价',
                value: function value(d) {
                  return d.lastPrice;
                },
                stroke: '#96b9cf'
              }]), fontSize: 15
            })
          ),
          _react2.default.createElement(
            _cefcReactstockcharts.Chart,
            { id: 2, yExtents: [function (d) {
                return d.volume;
              }], height: barChartHeight, origin: function origin(w, h) {
                return [0, h - 40];
              } },
            _react2.default.createElement(_cefcReactstockcharts.axes.YAxis, { axisAt: 'left', orient: 'left', ticks: 5, tickFormat: (0, _d3Format.format)('.0s'), zoomEnabled: false, showTicks: false, showDomain: false }),
            _react2.default.createElement(_cefcReactstockcharts.series.BarSeries, {
              yAccessor: function yAccessor(d) {
                return d.volume;
              }, fill: function fill(d) {
                return d.volume ? d.volumeColor : '#393c43';
              }
            })
          )
        )
      );
    }
  }]);

  return stockChartTimeline;
}(_react.Component);

stockChartTimeline.propTypes = {
  chartData: _propTypes2.default.array.isRequired,
  lineChartHeight: _propTypes2.default.number,
  barChartHeight: _propTypes2.default.number,
  width: _propTypes2.default.number,
  ratio: _propTypes2.default.number,
  height: _propTypes2.default.number,
  type: _propTypes2.default.oneOf(['svg', 'hybrid'])
};

stockChartTimeline.defaultProps = {
  type: 'hybrid',
  lineChartHeight: 180,
  barChartHeight: 40
};

exports.default = _cefcReactstockcharts.helper.fitDimensions(stockChartTimeline);