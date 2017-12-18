import React from "react";
import Timeline from "../build";
import styles from "../build/style/index.less";
import PropTypes from "prop-types";

class App extends React.Component {
  handleTimeLineChartConfig = () => {
    let { series, xAxis, yAxis } = timeLineConfig;
    let yAxisLeft = yAxis[0].tickPositions;
    let yAxisRight = yAxis[2].tickPositions;
    let { categories } = xAxis[0];
    let dataArr = [];
    series.map(function(item, index) {
      if (item.name == "均价") {
        item.data.map(function(n, i) {
          let eachData = {};
          let value = n;

          if (dataArr[i]) {
            let item = dataArr[i];
            item["avgPrice"] = value;
          } else {
            eachData["avgPrice"] = value;
            dataArr.push(eachData);
          }
        });
      }

      if (item.name == "当前价") {
        item.data.map(function(n, i) {
          let eachData = {};
          let value = n;

          if (dataArr[i]) {
            let item = dataArr[i];
            item["lastPrice"] = value;
          } else {
            eachData["lastPrice"] = value;
            dataArr.push(eachData);
          }
        });
      }

      if (item.type == "column") {
        item.data.map(function(n, i) {
          let eachData = {};

          if (dataArr[i]) {
            for (let k in n) {
              let item = dataArr[i];
              item[k] = n[k];
              item.x = categories[i];
            }
          } else {
            for (let k in n) {
              eachData[k] = n[k];
              eachData.x = categories[i];
            }

            dataArr.push(eachData);
          }
        });
      }
    });
    let yExtents = [yAxisLeft[2], yAxisLeft[0]];

    return dataArr;
  };

  calculateData(data) {
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
    let dataArr =
      timeLineConfig && this.handleTimeLineChartConfig(timeLineConfig);
    let finalData = this.calculateData(dataArr);

    return (
      <div className="demoContainer">
        <Timeline chartData={finalData} chartMargin={{left: 0, right: 0, top: 10, bottom: 0}} showGrid={true}/>
      </div>
    );
  }
}

export default App;

const timeLineConfig = {"global":{"useUTC":true},"legend":{"enabled":false},"rangeSelector":{"enabled":false},"exporting":{"enabled":false},"credits":{"enabled":false},"navigator":{"enabled":false},"tooltip":{"backgroundColor":"rgba(10, 10, 10, 0.8)","borderWidth":0,"shadow":true,"shared":true,"crosshairs":true},"title":null,"chart":{"type":"area","animation":false,"zoomType":"none","panning":false,"pinchType":"none","backgroundColor":"#393c43","plotBorderColor":"#434750","plotBorderWidth":1,"height":251.5,"margin":[2,0,0,0],"spacing":[0,0,0,0]},"plotOptions":{"column":{"colorByPoint":true},"area":{"fillColor":"rgba(0,171,243,.1)"},"series":{"fillOpacity":0.1,"states":{"hover":{"enabled":false}},"line":{"marker":{"enabled":false}}}},"xAxis":[{"type":"datetime","gridLineColor":"#434750","gridLineWidth":1,"tickWidth":0,"categories":["09:30","09:31","09:32","09:33","09:34","09:35","09:36","09:37","09:38","09:39","09:40","09:41","09:42","09:43","09:44","09:45","09:46","09:47","09:48","09:49","09:50","09:51","09:52","09:53","09:54","09:55","09:56","09:57","09:58","09:59","10:00","10:01","10:02","10:03","10:04","10:05","10:06","10:07","10:08","10:09","10:10","10:11","10:12","10:13","10:14","10:15","10:16","10:17","10:18","10:19","10:20","10:21","10:22","10:23","10:24","10:25","10:26","10:27","10:28","10:29","10:30","10:31","10:32","10:33","10:34","10:35","10:36","10:37","10:38","10:39","10:40","10:41","10:42","10:43","10:44","10:45","10:46","10:47","10:48","10:49","10:50","10:51","10:52","10:53","10:54","10:55","10:56","10:57","10:58","10:59","11:00","11:01","11:02","11:03","11:04","11:05","11:06",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"15:00"],"startOnTick":true,"endOntick":true,"tickPositions":[0,120,239],"labels":{"enabled":false,"useHTML":true,"style":{"color":"#ccc"},"step":1,"x":0,"y":12}}],"yAxis":[{"tickPositions":["12.53","12.62","12.71"],"opposite":false,"labels":{"style":{"color":"#ccc"},"align":"left","x":0,"y":10},"title":{"text":""},"height":"70%","lineWidth":1,"gridLineWidth":1,"gridLineColor":"#434750"},{"tickPositions":[0,5150],"tickWidth":0,"startOnTick":true,"endOntick":true,"opposite":false,"labels":{"enabled":false},"title":{"text":""},"top":"75%","height":"25%","lineWidth":0,"gridLindeWidth":1,"gridLineColor":"#434750"},{"tickPositions":["-0.73","0.73"],"opposite":true,"labels":{"style":{"color":"#ccc"},"align":"right","x":0,"y":10},"title":{"text":""},"height":"70%","lineWidth":1,"gridLineWidth":1,"gridLineColor":"#434750"}],"series":[{"animation":false,"name":"当前价","data":[12.66,12.66,12.67,12.64,12.67,12.64,12.63,12.62,12.64,12.64,12.62,12.64,12.64,12.64,12.64,12.62,12.67,12.68,12.68,12.67,12.69,12.68,12.68,12.68,12.67,12.66,12.67,12.67,12.66,12.65,12.66,12.64,12.64,12.65,12.64,12.67,12.65,12.65,12.69,12.69,12.66,12.68,12.67,12.67,12.67,12.68,12.67,12.67,12.68,12.68,12.66,12.66,12.68,12.66,12.67,12.66,12.65,12.66,12.66,12.66,12.65,12.65,12.65,12.65,12.68,12.66,12.67,12.67,12.67,12.68,12.68,12.68,12.67,12.65,12.66,12.65,12.67,12.67,12.67,12.68,12.67,12.66,12.65,12.66,12.65,12.65,12.67,12.67,12.66,12.65,12.65,12.67,12.65,12.65,12.67,12.65,12.64,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],"lineColor":"#96b9cf","lineWidth":0.8,"shadow":{"color":"#23b4de","opacity":0.2,"offsetY":1},"dataGrouping":{"enabled":false,"forced":true},"yAxis":0},{"animation":false,"type":"line","name":"均价","data":[12.69,12.69,12.68,12.68,12.68,12.68,12.67,12.67,12.67,12.67,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.67,12.67,12.67,12.67,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.66,12.66,12.67,12.67,12.67,12.67,12.67,12.67,12.67,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66,12.66],"lineColor":"rgba(255, 255, 0, 0.7)","lineWidth":0.8,"dataGrouping":{"enabled":false,"forced":true},"yAxis":0},{"animation":true,"type":"column","name":"成交量","data":[{"y":5150,"color":"red"},{"y":774,"color":"red"},{"y":647,"color":"red"},{"y":826,"color":"green"},{"y":663,"color":"red"},{"y":494,"color":"green"},{"y":490,"color":"green"},{"y":978,"color":"green"},{"y":582,"color":"red"},{"y":672,"color":"red"},{"y":418,"color":"green"},{"y":677,"color":"red"},{"y":341,"color":"red"},{"y":389,"color":"red"},{"y":407,"color":"red"},{"y":958,"color":"green"},{"y":947,"color":"red"},{"y":832,"color":"red"},{"y":629,"color":"red"},{"y":592,"color":"green"},{"y":960,"color":"red"},{"y":580,"color":"green"},{"y":313,"color":"red"},{"y":484,"color":"red"},{"y":661,"color":"green"},{"y":598,"color":"green"},{"y":1508,"color":"red"},{"y":707,"color":"red"},{"y":617,"color":"green"},{"y":715,"color":"green"},{"y":1773,"color":"red"},{"y":676,"color":"green"},{"y":570,"color":"red"},{"y":660,"color":"red"},{"y":735,"color":"green"},{"y":3018,"color":"red"},{"y":511,"color":"green"},{"y":871,"color":"red"},{"y":2185,"color":"red"},{"y":1009,"color":"red"},{"y":267,"color":"green"},{"y":447,"color":"red"},{"y":432,"color":"green"},{"y":527,"color":"red"},{"y":364,"color":"red"},{"y":358,"color":"red"},{"y":337,"color":"green"},{"y":321,"color":"red"},{"y":261,"color":"red"},{"y":384,"color":"red"},{"y":192,"color":"green"},{"y":553,"color":"red"},{"y":188,"color":"red"},{"y":517,"color":"green"},{"y":216,"color":"red"},{"y":463,"color":"green"},{"y":398,"color":"green"},{"y":458,"color":"red"},{"y":329,"color":"red"},{"y":245,"color":"red"},{"y":390,"color":"green"},{"y":401,"color":"red"},{"y":542,"color":"red"},{"y":298,"color":"red"},{"y":746,"color":"red"},{"y":180,"color":"green"},{"y":330,"color":"red"},{"y":224,"color":"red"},{"y":435,"color":"red"},{"y":549,"color":"red"},{"y":301,"color":"red"},{"y":289,"color":"red"},{"y":742,"color":"green"},{"y":1121,"color":"green"},{"y":284,"color":"red"},{"y":759,"color":"green"},{"y":185,"color":"red"},{"y":215,"color":"red"},{"y":327,"color":"red"},{"y":355,"color":"red"},{"y":669,"color":"green"},{"y":254,"color":"green"},{"y":419,"color":"green"},{"y":135,"color":"red"},{"y":295,"color":"green"},{"y":521,"color":"red"},{"y":431,"color":"red"},{"y":342,"color":"red"},{"y":1024,"color":"green"},{"y":247,"color":"green"},{"y":163,"color":"red"},{"y":865,"color":"red"},{"y":767,"color":"green"},{"y":222,"color":"red"},{"y":430,"color":"red"},{"y":299,"color":"green"},{"y":160,"color":"green"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],"color":"#23b4de","yAxis":1,"dataGrouping":{"enabled":false,"forced":true}}]};
