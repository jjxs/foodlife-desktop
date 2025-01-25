import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ChartsService } from '../charts.service';
import { MatDialog } from '@angular/material';
import { CounterService } from '../../counter/counter.service';
import { EChartOption } from 'echarts';
import { AuthenticationService, JsonService, Util, JsonResult} from 'ami';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _moment from 'moment';
const moment =  _moment;


export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM',
  },
  display: {
    dateInput: 'YYYY/MM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'restaurant-chart-month',
  templateUrl: './chart-month.component.html',
  styleUrls: ['./chart-month.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class ChartMonthComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  seriesData = [0, 0, 0, 0, 0, 0, 0];
  seriesDinnerData = [0, 0, 0, 0, 0, 0, 0];
  seriesLunchData = [0, 0, 0, 0, 0, 0, 0];

  chartOption: EChartOption;
  xAxisData = [];

  displayedColumns: string[] = ['month', 'counter', 'person', 'pay_price', 'per_price'];
  dataSource;
  start_date = '';
  end_date = '';

  date1 = new FormControl(moment());
  date2 = new FormControl(moment().endOf('month'));

  constructor(
    private jsonSrv: JsonService,
    public counterSrv: CounterService) {
      this.dateChange(this.date1, 1);
      this.dateChange(this.date2, 2);
    }

  ngOnInit() {
    this.getData();
  }

  dateChange(date, type) {
    let d = date.value;
    if ( type == 1 ) {
      this.start_date = d.year() + '-' + (d.month() + 1) + '-01';
    } else {
      d = d.endOf('month')
      this.end_date = d.year() + '-' + (d.month() + 1) + '-' + d.date();
    }
    this.getData();
  }

  getData() {
    if ( Util.isEmpty(this.start_date) || Util.isEmpty(this.end_date) ) {
      return false;
    }
    const datetime = new Date(this.start_date);
    const end_date = new Date(this.end_date);

    const seriesData = {};
    this.seriesData = [];
    this.xAxisData = [];
    const data = [];

    while ( true ) {
      const key = datetime.getFullYear() + '/' + this.getMonth(datetime);
      seriesData[key] =  Object.keys(seriesData).length;
      this.seriesData.push(0);
      this.xAxisData.push(key);
      data.push({
        'month': key,
        'counter' : 0,
        'person'  : 0,
        'pay_price' : 0,
        'per_price' : 0
      });
      datetime.setMonth(datetime.getMonth() + 1);
      if ( datetime > end_date ) {
        break;
      }
    }

    // tslint:disable-next-line: max-line-length
    this.jsonSrv.get('restaurant/charts/month/', { 'start_date': this.start_date, 'end_date': this.end_date }).subscribe((response?: any) => {
      if (!Util.isEmpty(response)) {
        response.forEach((element: any) => {
          const date = (new Date(element['date']));
          const key = date.getFullYear() + '/' + this.getMonth(date);

          const index = seriesData[key];
          this.seriesData[index] += element['pay_price'];
          data[index] = {
            'month': key,
            'counter' : data[index]['counter'] + element['counter'],
            'person'  : data[index]['person'] + element['person'],
            'pay_price' : data[index]['pay_price'] + element['pay_price'],
            'per_price' : 0
          };

          if ( data[index]['person'] > 0 ) {
            data[index]['per_price'] = Math.ceil( data[index]['pay_price'] / data[index]['person'] );
          }
        });
        this.chartOption = this.getOption();
        this.dataSource = new MatTableDataSource(data);
        this.sort.sort({ id: 'month', start: 'desc', disableClear: false });
        this.dataSource.sort = this.sort;
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
      //   text : '月別売上統計表',
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

  

  chosenYearHandler(normalizedYear, date) { 
    const ctrlValue = date.value;
    // ctrlValue.year(normalizedYear.year());
    ctrlValue.year((new Date(normalizedYear)).getFullYear());
    date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth, date, datepicker, type) { 
    const ctrlValue = date.value;
    // ctrlValue.month(normalizedMonth.month());
    ctrlValue.month((new Date(normalizedMonth)).getMonth());
    date.setValue(ctrlValue);
    datepicker.close();
    this.dateChange(date, type);
  }


}
