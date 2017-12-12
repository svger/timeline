import React, { Component } from "react";
import Chart from "./Chart";
import styles from "./style/index.less";
import PropTypes from "prop-types";

class stockChartTimeline extends Component {
  static propTypes = {
    config: PropTypes.object,
    startDay: PropTypes.string,
    endDay: PropTypes.string,
    volumeMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onToggleOrientation: PropTypes.func,
    kLineChartConfig: PropTypes.object
  };
 
  calculateData() {
    const { data } = this.props;
    let array = [];
    data.map((item, index) => {
      let date = new Date(item.x);
      let date1 = date.toUTCString();
      let finalDate = new Date(date1);
      let newItem = {};
      newItem.date = finalDate;
      newItem.absoluteChange = item.absoluteChange;
      newItem.close = item.close;
      newItem.dividend = item.dividend;
      newItem.high = item.high;
      newItem.low = item.low;
      newItem.open = item.open;
      newItem.volume = item.y;
      newItem.volumeColor = item.color;
      newItem.x = item.x;
      newItem.avgPrice = item.avgPrice;
      newItem.lastPrice = item.lastPrice;
      array.push(newItem);
    });

    return array;
  }

  render() {
    let finalData = this.calculateData();
    const { yExtents } = this.props;

    return (
      <div className={styles.container_bg_ChatBkg}>
        <Chart type="hybrid" data={finalData} yExtents={yExtents} />
      </div>
    );
  }
}

export default stockChartTimeline;
