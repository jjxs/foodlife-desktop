import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  // チャート設定
  chartOption = {
    baseOption: {
      title: {
        text: 'デモ'
      },
      legend: {
        orient: 'vertical'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '売上',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320, 250, 890, 990, 1900, 1050]
      }]
    },
    media: [
      // 这里定义了 media query 的逐条规则。
      {
        // 这里写规则。
        option: {       // 这里写此规则满足下的option。
          series: [{ type: 'line' }],
        }
      },
      {
        query: {
          maxWidth: 960,
        },
        // 这里写规则。
        option: {
          series: [{
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }],
        }
      }
    ]
  };
  constructor() { }

  ngOnInit() {
  }

}
