# TimeLine
分时图组件

| 属性        | 说明                          | 类型            | 默认值         |
| --------- | --------------------------- | ------------- | ----------- |
| chartData | chartData `{"lastPrice":29.85,"avgPrice":30.03,"y":1095,"x":"14:24","color":"green"}` | array        |  null |
| lineChartHeight | 设置上面折线图的高度 | number        |  180 |
| barChartHeight | 设置下面面柱状的高度 | number        |  40 |
| height | 设置整个图表的高度 | number        |  无 |
| width | 设置整个图表的宽度 | number        |  填充整个父盒子 |
| type |  绘图类型可以选: svg 或 hybrid。hybrid 将使用 canvas 创建 DataSeries 的内容,但轴和其他元素是 svg | oneOf(["svg", "hybrid"])        |  "svg" |
| chartMargin |  chartMargin用来设置图表的margin，传入形式为chartMargin={{left: 0, right: 0, top: 10, bottom: 50}} | object       |  left: 0, right: 0, top: 10, bottom: 50 |
| showGrid |  是否显示网格线 | bool       |  true|
| backgroundColor |  设置整个画布的背景色 | string       |  透明|
| offset |  每个item之间的间距 | number       |  3|

