'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Scale = require('d3-scale');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _d3Format = require('d3-format');

var _cefcStockcharts = require('cefc-stockcharts');

var _index = require('./style/index.css');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @description 将纯数字转换为包含中文单位万或者亿的数量
 * @author CarltonXiang
 * @config config
 *  @param num  待格式化的数字
 *  @param isInteger  是否显示整数
 *  @param precision 小数点精度 3代表显示3位小数，2代表显示2位小数
 *  @param defaultValue 默认显示
 */
var unitFormat = function unitFormat(config) {
  var value = '';
  var precision = 2; // 小数点精度，默认显示2位小数
  var isInteger = false; //是否是整数，不显示小数点
  var defaultValue = '--'; //默认显示
  var minUnitNum = 100000;
  var ONE_MILLION = 1000000;

  if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
    value = config.value;
    precision = config.precision || precision;
    isInteger = config.isInteger || isInteger;
    defaultValue = config.defaultValue || defaultValue;
    minUnitNum = config.minUnitNum || minUnitNum;
  } else {
    value = config;
  }

  var retNum = parseFloat(value);

  //若不是数字，返回默认数字
  if (isNaN(retNum)) {

    return defaultValue;
  }

  var YI = ONE_MILLION * 100;
  var WAN = ONE_MILLION / 100;

  var baseRate = retNum >= YI ? YI : retNum >= minUnitNum ? WAN : 1;
  var integerName = retNum >= YI ? '亿' : retNum >= minUnitNum ? '万' : '';

  retNum = retNum / baseRate;

  //数字1亿显示亿，大于百万显示万
  if (isInteger) {
    return '' + Math.round(retNum) + integerName;
  }

  var scale = Math.pow(10, parseInt(precision));
  retNum = isInteger ? Math.round(retNum) : parseFloat((Math.round(retNum * scale) / scale).toFixed(precision));

  return integerName ? '' + retNum + integerName : parseFloat(retNum);
};

/**
 * @description 格式化数字，根据数据精度，显示小数点的位数
 * @author CarltonXiang
 * @config
 *  @param value  待格式化的数字
 *  @param precision 小数点精度 3代表显示3位小数，2代表显示2位小数
 *  @param defaultValue 默认显示
 * @returns {string}
 */
var decimalFormat = function decimalFormat(config, preci) {
  var value = '';
  var precision = 2; // 小数点精度，默认显示2位小数
  var defaultValue = '--'; //默认显示

  if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
    value = config.value;
    precision = config.precision || precision;
    defaultValue = config.defaultValue || defaultValue;
  } else {
    value = config;
    precision = preci ? preci : precision;
  }

  var returnNum = parseFloat(value);

  //不是数字，返回默认显示
  if (isNaN(returnNum)) {

    return defaultValue;
  }

  var val = returnNum * Math.pow(10, precision);

  return (Math.round(val) / Math.pow(10, precision)).toFixed(precision);
};

function tooltipContent(ys, precision) {
  return function (_ref) {
    var currentItem = _ref.currentItem;
    var volume = currentItem.volume,
        avgPrice = currentItem.avgPrice,
        lastPrice = currentItem.lastPrice;

    var timeLineJudge = !avgPrice && !lastPrice && !volume;

    if (timeLineJudge) {
      return null;
    }

    return {
      x: '时间: ' + currentItem.x,
      y: ys.map(function (each) {
        return {
          label: each.value(currentItem) && each.label,
          value: each.value(currentItem) && decimalFormat({ value: Number(each.value(currentItem)), precision: precision })
        };
      }).concat([{
        label: '成交量',
        value: currentItem.volume && unitFormat({ value: currentItem.volume, precision: precision }) + '手'
      }]).filter(function (line) {
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
          barChartHeight = _props.barChartHeight,
          chartMargin = _props.chartMargin,
          showGrid = _props.showGrid,
          yExtents = _props.yExtents,
          backgroundColor = _props.backgroundColor,
          style = _props.style,
          offset = _props.offset,
          lineTickValues = _props.lineTickValues,
          barTickValues = _props.barTickValues,
          eventCoordinateReverse = _props.eventCoordinateReverse,
          isIndex = _props.isIndex,
          gridLabel = _props.gridLabel,
          precision = _props.precision,
          isHKStock = _props.isHKStock;
      var yAxisLeft = gridLabel.yAxisLeft,
          yAxisRight = gridLabel.yAxisRight,
          volumeMaxValue = gridLabel.volumeMaxValue;

      var xScaleProvider = _cefcStockcharts.scale.discontinuousTimeScaleProvider.inputDateAccessor(function (d) {
        return d.date;
      });

      var _xScaleProvider = xScaleProvider(chartData),
          data = _xScaleProvider.data,
          xAccessor = _xScaleProvider.xAccessor,
          displayXAccessor = _xScaleProvider.displayXAccessor;

      var gridHeight = height - chartMargin.top - chartMargin.bottom;
      var gridWidth = width - chartMargin.left - chartMargin.right;
      var lineYGrid = showGrid ? {
        innerTickSize: -1 * gridWidth,
        tickStrokeDasharray: 'Solid',
        tickStrokeOpacity: 1,
        tickStrokeWidth: 1,
        tickSize: 100,
        tickValues: lineTickValues
      } : {};
      var xGrid = showGrid ? {
        innerTickSize: -1 * gridHeight,
        tickStrokeDasharray: 'Solid',
        tickStrokeOpacity: 1,
        tickStrokeWidth: 1,
        tickSize: 100,
        tickValues: [parseInt(data.length / 2)]
      } : {};
      var barYGrid = showGrid ? {
        innerTickSize: -1 * gridWidth,
        tickStrokeDasharray: 'Solid',
        tickStrokeOpacity: 1,
        tickStrokeWidth: 1,
        tickSize: 100,
        tickValues: barTickValues
      } : {};
      style.backgroundColor = backgroundColor;
      var landscape = false;

      if (!isIndex && 1.5 * height < width) {
        // 说明是非指数 横屏
        landscape = true;
      }
      var delta = (Number(yExtents[0]) - Number(yExtents[1])) * 0.01;
      var totalDotsNum = isHKStock ? 330 : 240;
      var xAxisLabel = isHKStock ? ['9:30', '12:00', '16:00'] : ['9:30', '11:30|13:00', '15:00'];

      return _react2.default.createElement(
        'div',
        { className: 'container_bg_ChatBkg', style: style },
        _react2.default.createElement(
          'div',
          { className: 'realTimeOpenCloseTime' },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)('fl_left', { index: isIndex }, { landscape: landscape }) },
            xAxisLabel[0]
          ),
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)('fl_middle', { index: isIndex }, { landscape: landscape }) },
            xAxisLabel[1]
          ),
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)('fl_right', { index: isIndex }, { landscape: landscape }) },
            xAxisLabel[2]
          ),
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)('yAxisLeft_top', { index: isIndex }, { landscape: landscape }) },
            yAxisLeft[2]
          ),
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)('yAxisLeft_middle', { index: isIndex }, { landscape: landscape }) },
            yAxisLeft[1]
          ),
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)('yAxisLeft_bottom', { index: isIndex }, { landscape: landscape }) },
            yAxisLeft[0]
          ),
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)('yAxisLeft_bottom_volume', { index: isIndex }, { landscape: landscape }) },
            volumeMaxValue
          ),
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)('yAxisRight_top', { index: isIndex }, { landscape: landscape }) },
            yAxisRight[1]
          ),
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)('yAxisRight_bottom', { index: isIndex }, { landscape: landscape }) },
            yAxisRight[0]
          )
        ),
        _react2.default.createElement(
          _cefcStockcharts.ChartCanvas,
          { height: height, width: width, ratio: ratio, displayXAccessor: displayXAccessor, margin: chartMargin, type: type, seriesName: 'MSFT', data: data, xScale: (0, _d3Scale.scaleLinear)(), xAccessor: xAccessor, xExtents: [totalDotsNum, 0], zoomMultiplier: 0, zIndex: 0, xAxisZoom: function xAxisZoom() {}, onSelect: this.onSelect, defaultFocus: false, zoomEvent: false, clamp: false, eventCoordinateReverse: eventCoordinateReverse, panEvent: true, mouseMoveEvent: true },
          _react2.default.createElement(
            _cefcStockcharts.Chart,
            { id: 1, yExtents: [Number(yExtents[0]) + delta, Number(yExtents[1]) - delta], height: lineChartHeight, origin: function origin(w, h) {
                return [0, 0];
              } },
            _react2.default.createElement(_cefcStockcharts.axes.XAxis, _extends({ axisAt: 'bottom', orient: 'bottom', ticks: 1, zoomEnabled: false, showTickLabel: false }, xGrid)),
            _react2.default.createElement(_cefcStockcharts.axes.YAxis, _extends({ axisAt: 'right', orient: 'right', zoomEnabled: false, showTickLabel: false }, lineYGrid, { showDomain: false })),
            _react2.default.createElement(_cefcStockcharts.series.LineSeries, {
              yAccessor: function yAccessor(d) {
                return d.avgPrice;
              },
              stroke: 'rgba(255, 255, 0, 0.7)'
            }),
            _react2.default.createElement(_cefcStockcharts.series.AreaSeries, {
              yAccessor: function yAccessor(d) {
                return d.lastPrice;
              },
              stroke: '#96b9cf'
            }),
            _react2.default.createElement(_cefcStockcharts.tooltip.HoverTooltip, {
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
              }], precision),
              fontSize: 12,
              offset: offset
            })
          ),
          _react2.default.createElement(
            _cefcStockcharts.Chart,
            { id: 2, yExtents: [function (d) {
                return d.volume;
              }], height: barChartHeight, origin: function origin(w, h) {
                return [0, h - barChartHeight];
              } },
            _react2.default.createElement(_cefcStockcharts.axes.YAxis, _extends({ axisAt: 'left', orient: 'left', ticks: 1, tickFormat: (0, _d3Format.format)('.0s'), zoomEnabled: false, showTickLabel: false }, barYGrid, { showDomain: false })),
            _react2.default.createElement(_cefcStockcharts.axes.XAxis, _extends({ axisAt: 'bottom', orient: 'bottom', zoomEnabled: false, showTickLabel: false }, xGrid, { showDomain: false })),
            _react2.default.createElement(_cefcStockcharts.series.BarSeries, {
              yAccessor: function yAccessor(d) {
                return d.volume;
              }, fill: function fill(d) {
                return d.volume ? d.volumeColor : '#393c43';
              },
              offset: offset
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
  lineTickValues: _propTypes2.default.array,
  barTickValues: _propTypes2.default.array,
  width: _propTypes2.default.number,
  ratio: _propTypes2.default.number,
  height: _propTypes2.default.number,
  type: _propTypes2.default.oneOf(['svg', 'hybrid']),
  chartMargin: _propTypes2.default.shape({
    left: _propTypes2.default.number,
    right: _propTypes2.default.number,
    top: _propTypes2.default.number,
    bottom: _propTypes2.default.number
  }),
  showGrid: _propTypes2.default.bool,
  yExtents: _propTypes2.default.array,
  isIndex: _propTypes2.default.bool,
  gridLabel: _propTypes2.default.shape({
    yAxisLeft: _propTypes2.default.array,
    yAxisRight: _propTypes2.default.array,
    volumeMaxValue: _propTypes2.default.number
  }),
  backgroundColor: _propTypes2.default.string,
  style: _propTypes2.default.object,
  offset: _propTypes2.default.number,
  eventCoordinateReverse: _propTypes2.default.bool,
  precision: _propTypes2.default.number,
  isHKStock: _propTypes2.default.bool
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
  gridLabel: _propTypes2.default.shape({
    yAxisLeft: [],
    yAxisRight: [],
    volumeMaxValue: 0
  }),
  chartMargin: {
    left: 5, right: 5, top: 10, bottom: 0
  },
  showGrid: true,
  backgroundColor: '#393c43',
  style: {},
  precision: 2,
  isHKStock: false
};

exports.default = _cefcStockcharts.helper.fitDimensions(stockChartTimeline);