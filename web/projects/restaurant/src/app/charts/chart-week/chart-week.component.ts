import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChartsService } from '../charts.service';
import { MatDialog } from '@angular/material';
import { CounterService } from '../../counter/counter.service';
import { EChartOption } from 'echarts';
import { AuthenticationService, JsonService, Util, JsonResult} from 'ami';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'restaurant-chart-week',
  templateUrl: './chart-week.component.html',
  styleUrls: ['./chart-week.component.css']
})
export class ChartWeekComponent implements OnInit {
  seriesData = [0, 0, 0, 0, 0, 0, 0];
  seriesDinnerData = [0, 0, 0, 0, 0, 0, 0];
  seriesLunchData = [0, 0, 0, 0, 0, 0, 0];

  chartOption: EChartOption;

  displayedColumns: string[] = ['week', 'lunch', 'dinner', 'total'];
  dataSource = [];

  start_date = '';
  end_date = '';

  date1;
  date2;

  constructor(
    private jsonSrv: JsonService,
    public counterSrv: CounterService) {
      const date = new Date();
      this.end_date = date.toLocaleDateString();

      date.setDate(date.getDate() - 7);
      this.start_date = date.toLocaleDateString();

      this.date1 = new FormControl(new Date(this.start_date));
      this.date2 = new FormControl(new Date(this.end_date));
    }

  ngOnInit() {
    this.getData();
  }

  dateChange(event, type) {
    let d = new Date(event.value);
    if( type==1 ) {
      this.start_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    } else {
      this.end_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }
    this.getData();
  }

  getData() {
    if ( Util.isEmpty(this.start_date) || Util.isEmpty(this.end_date) ) {
      return false;
    }
    this.seriesData = [0, 0, 0, 0, 0, 0, 0];
    this.seriesDinnerData = [0, 0, 0, 0, 0, 0, 0];
    this.seriesLunchData = [0, 0, 0, 0, 0, 0, 0];
    this.dataSource = [
      {week: '月曜日', lunch: 0, dinner: 0, total: 0},
      {week: '火曜日', lunch: 0, dinner: 0, total: 0},
      {week: '水曜日', lunch: 0, dinner: 0, total: 0},
      {week: '木曜日', lunch: 0, dinner: 0, total: 0},
      {week: '金曜日', lunch: 0, dinner: 0, total: 0},
      {week: '土曜日', lunch: 0, dinner: 0, total: 0},
      {week: '日曜日', lunch: 0, dinner: 0, total: 0}
    ];

    this.jsonSrv.get('restaurant/charts/week/', { 'start_date': this.start_date, 'end_date': this.end_date }).subscribe((response?: any) => {
      if (!Util.isEmpty(response)) {
        response.forEach((element: any) => {
          let week = (new Date(element['date'])).getDay();
          let index = 0;
          if ( week == 0 ) {
            index = 6;
          } else {
            index = week - 1;
          }
          this.seriesData[index] += element['pay_price'];
          this.dataSource[index]['total'] += element['pay_price'];

          this.seriesDinnerData[index] += element['pay_price_dinner'];
          this.dataSource[index]['dinner'] += element['pay_price_dinner'];

          this.seriesLunchData[index] += element['pay_price_lunch'];
          this.dataSource[index]['lunch'] += element['pay_price_lunch'];
        });
        this.chartOption = this.getOption();
      }
    });
  }

  getOption() {
    let option: EChartOption = {
      // title: {
      //   text : '曜日別売上統計表',
      //   left: 'center',
      // },
      legend: {
        right: 10,
        top: 30,
        // orient: 'vertical',
        data:['ランチ','ディナー','合計']
      },
      tooltip: {
          trigger: 'axis'
      },
      grid: {
          left: '2%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          margin: 2,
          formatter: function (value, index) {
              if (value >= 1000 && value < 10000000) {
                  value = value / 10000 + '万';
              } else if (value >= 10000000) {
                  value = value / 10000000 + '千万';
              }
              return value;
          }
        }
      },
      series: [
        {
          name:'ランチ',
          data: this.seriesLunchData,
          type: 'line'
        },
        {
          name:'ディナー',
          data: this.seriesDinnerData,
          type: 'line'
        },
        {
          name:'合計',
          data: this.seriesData,
          type: 'line'
        }
      ]
    };
    return option;
  }

}
