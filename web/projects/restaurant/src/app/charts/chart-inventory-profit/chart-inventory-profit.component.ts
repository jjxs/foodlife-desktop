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
  selector: 'restaurant-chart-inventory-profit',
  templateUrl: './chart-inventory-profit.component.html',
  styleUrls: ['./chart-inventory-profit.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class ChartInventoryProfitComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  seriesData = [0, 0, 0, 0, 0, 0, 0];

  chartOption: EChartOption;
  xAxisData = [];

  start_date = '';
  end_date = '';

  date1 = new FormControl(moment());
  date2 = new FormControl(moment());

  constructor(
    private jsonSrv: JsonService,
    public counterSrv: CounterService) {
      this.dateChange(this.date1, 1);
      this.dateChange(this.date2, 2);
    }

  ngOnInit() {
    //this.getData();
  }

  dateChange(date, type) {
    const d = date.value;
    if ( type == 1 ) {
      this.start_date = d.year() + '-' + (d.month() + 1);
    } else {

      this.end_date = d.year() + '-' + (d.month() + 1);
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

    while ( true ) {
      const key = datetime.getFullYear() + '/' + this.getMonth(datetime);
      seriesData[key] =  Object.keys(seriesData).length;
      this.seriesData.push(0);
      this.xAxisData.push(key);
      datetime.setMonth(datetime.getMonth() + 1);
      if ( datetime > end_date ) { 
        break;
      }
    }

    console.log(this.start_date)
    console.log(this.end_date)
    const tempMap = {};
    this.jsonSrv.get('restaurant/charts/inventory_profit/', { 'start_date': this.start_date, 'end_date': this.end_date }).subscribe((response?: any) => {
      if (!Util.isEmpty(response)) {
        response.forEach((element: any) => {
          
          const date = (new Date(element['idate']));
          const key = date.getFullYear() + '/' + this.getMonth(date);
          
          if (Util.isEmpty(tempMap[key+element['part_id']])){
            tempMap[key+element['part_id']] = key+element['part_id'];
            const index = seriesData[key];
            this.seriesData[index] += element['price'];
          }

        });
        this.chartOption = this.getOption();
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
        data: ['合計']
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
        data: this.xAxisData
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
          name: '合計',
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
