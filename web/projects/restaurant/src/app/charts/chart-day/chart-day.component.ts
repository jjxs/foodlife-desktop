import { Component, OnInit, Input, Output, EventEmitter, ViewChild  } from '@angular/core';
import { ChartsService } from '../charts.service';
import { MatDialog } from '@angular/material';
import { CounterService } from '../../counter/counter.service';
import { EChartOption } from 'echarts';
import { AuthenticationService, JsonService, Util, JsonResult} from 'ami';
import {FormControl} from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import _ from 'lodash';

@Component({
  selector: 'restaurant-chart-day',
  templateUrl: './chart-day.component.html',
  styleUrls: ['./chart-day.component.css']
})
export class ChartDayComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  seriesData = [0, 0, 0, 0, 0, 0, 0];
  seriesDinnerData = [0, 0, 0, 0, 0, 0, 0];
  seriesLunchData = [0, 0, 0, 0, 0, 0, 0];

  chartOption: EChartOption;
  xAxisData = [];

  displayedColumns: string[] = ['day', 'counter', 'person', 'pay_price', 'per_price','money_price','paypay_price','other_price'];
  dataSource = new MatTableDataSource([]);

  start_date = '';
  end_date = '';
  sum_pay_price = 0;
  sum_paypay_price = 0;
  sum_money_price = 0;
  sum_other_price = 0;

  sum_per_price = 0;
  sum_person = 0;

  date1;
  date2;

  light = new FormControl(false);
  night = new FormControl(false);;

  constructor(
    private jsonSrv: JsonService,
    public counterSrv: CounterService) {
      const date = new Date();
      this.end_date = date.toLocaleDateString();

      date.setDate(date.getDate() - 29);
      this.start_date = date.toLocaleDateString();

      this.date1 = new FormControl(new Date(this.start_date));
      this.date2 = new FormControl(new Date(this.end_date));
    }

  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit() {
    this.sort.sort({ id: 'day', start: 'desc', disableClear: false });
    this.dataSource.sort = this.sort;
  }

  dateChange(event, type) {
    let d = new Date(event.value);
    if ( type == 1 ) {
      this.start_date = d.getFullYear() + '-' + this.getMonth(d) + '-' + this.getDate(d);
    } else {
      this.end_date = d.getFullYear() + '-' + this.getMonth(d) + '-' + this.getDate(d);
    }
    this.getData();
  }

  getData() {
    if ( Util.isEmpty(this.start_date) || Util.isEmpty(this.end_date) ) {
      return false;
    }
    const datetime = new Date(this.start_date);
    const end_date = new Date(this.end_date);

    this.sum_pay_price = 0;
    this.sum_per_price = 0;
    this.sum_money_price = 0;
    this.sum_paypay_price = 0;
    this.sum_other_price = 0;

    this.sum_person = 0;

    const seriesData = {};
    this.seriesData = [];
    this.xAxisData = [];
    let dataSource = [];

    while ( true ) {
      const date_key = this.getMonth(datetime) + '/' + this.getDate(datetime);

      seriesData[date_key] =  Object.keys(seriesData).length;
      this.seriesData.push(0);
      this.xAxisData.push(date_key);
      dataSource.push({
        'day': date_key,
        'counter' : 0,
        'person'  : 0,
        'pay_price' : 0,
        'per_price' : 0,
        'money_price' : 0,
        'paypay_price' : 0,
        'other_price' : 0
      });
      if ( datetime >= end_date ) {
        break;
      }
      datetime.setDate(datetime.getDate() + 1);
    }

    this.jsonSrv.get('restaurant/charts/day/', { 'start_date': this.start_date, 'end_date': this.end_date, 'light': this.light.value ? '1' : '0', 'night': this.night.value ? '1' : '0' }).subscribe((response?: any) => {
      if (!Util.isEmpty(response)) {
        
        response.forEach((element: any) => {
          const date = (new Date(element['date']));
          const date_key = this.getMonth(date) + '/' + this.getDate(date);
          const index = seriesData[date_key];
          this.seriesData[index] = element['pay_price'];
          let per_price = element['pay_price'];
          if ( element['person'] > 0 ) {
            per_price = Math.ceil(element['pay_price'] / element['person']);
          }
          dataSource[index] = {
            'day': date_key,
            'counter' : element['counter'],
            'person'  : element['person'],
            'pay_price' : element['pay_price'],
            'money_price' : element['money_price'],
            'paypay_price' : element['paypay_price'],
            'other_price' : element['other_price'],
            'per_price' : per_price
          };
        });
        this.chartOption = this.getOption();
        this.dataSource.data = dataSource
        this.dataSource.data.forEach((item) => {
          this.sum_pay_price += item.pay_price;
          this.sum_person += item.person;
          this.sum_money_price += item.money_price;
          this.sum_paypay_price += item.paypay_price;
          this.sum_other_price += item.other_price;

        });
        this.sum_per_price = this.sum_pay_price/this.sum_person
      }
    });
  }

  getMonth(date) {
    const d = (date.getMonth() + 1);
    if ( ('' + d).length >= 2 ) {
      return d;
    } else {
      return '0' + d;
    }
  }

  getDate(date) {
    const d = (date.getDate());
    if ( ('' + d).length >= 2 ) {
      return d;
    } else {
      return '0' + d;
    }
  }

  getOption() {
    const newXAxisData = [];
    for ( let i = 1; i <= this.xAxisData.length; i++ ) {
      newXAxisData.push(this.xAxisData[this.xAxisData.length-i])
    }

    const newSeriesData = [];
    for ( let i = 1; i <= this.seriesData.length; i++ ) {
      newSeriesData.push(this.seriesData[this.seriesData.length-i])
    }

    const option: EChartOption = {
      // title: {
      //   text : '日別売上統計表',
      //   left: 'center',
      // },
      legend: {
        right: 10,
        top: 30,
        // orient: 'vertical',
        data: ['売上']
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
        data: newXAxisData
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
          name: '売上',
          data: newSeriesData,
          type: 'line'
        }
      ]
    };
    return option;
  }

  checkGroup(event, type) {
    type? this.night.patchValue(event.checked) : this.light.patchValue(event.checked)
    this.getData()
  }
}
