import { Component, OnInit, Input, Output, EventEmitter, ViewChild  } from '@angular/core';
import { ChartsService } from '../charts.service';
import { MatDialog } from '@angular/material';
import { CounterService } from '../../counter/counter.service';
import { EChartOption } from 'echarts';
import { AuthenticationService, JsonService, Util, JsonResult} from 'ami';
import {FormControl} from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'restaurant-chart-profit',
  templateUrl: './chart-profit.component.html',
  styleUrls: ['./chart-profit.component.css']
})
export class ChartProfitComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  seriesData = [0, 0, 0, 0, 0, 0, 0];
  seriesDinnerData = [0, 0, 0, 0, 0, 0, 0];
  seriesLunchData = [0, 0, 0, 0, 0, 0, 0];

  chartOption: EChartOption;
  xAxisData = [];

  displayedColumns: string[] = ['menu_name', 'total', 'total_price', 'profit'];
  dataSource;
  costs;

  start_date = '';
  end_date = '';

  date1;
  date2;

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
    // this.getData();
  }

  dateChange(event, type) {
    let d = new Date(event.value);
    if ( type == 1 ) {
      this.start_date = d.getFullYear() + '-' + this.getMonth(d) + '-' + this.getDate(d);
    } else {
      this.end_date = d.getFullYear() + '-' + this.getMonth(d) + '-' + this.getDate(d);
    }
    // this.getData();
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

  getData() {
    if ( Util.isEmpty(this.start_date) || Util.isEmpty(this.end_date) ) {
      return false;
    }
    this.seriesData = [];
    this.xAxisData = [];
    const dataSource = [];
    // const menus = [];
    const costs = [];

    // tslint:disable-next-line: max-line-length
    this.jsonSrv
        .get('restaurant/charts/profit/', { 'start_date': this.start_date, 'end_date': this.end_date })
        .subscribe((response?: any) => {
      if (!Util.isEmpty(response)) {
        response.menulist.forEach((element: any) => {
          dataSource.push(element);
        });
        // response.costs.forEach((element: any) => {
        //   costs.push(element);
        // });
        this.chartOption = this.getOption();
        this.dataSource = new MatTableDataSource(dataSource);
        // this.costs = new MatTableDataSource(costs);
        this.dataSource.sort = this.sort;
        // this.costs.sort = this.sort;
        this.dataSource.data.forEach(element => {
          if (element['total_cost'] !== null) {
            element['profit'] = element['total_price'] - element['total_cost'];
          } else {
            element['profit'] = 0;
          }
          // element['profit'] = this.costs.filter(row => {
          //   if (row['nemu_id'] === element['nemu_id']) {
          //     return row['cost'] * element['total'];
          //   }
          // });
        });
      }
    });
  }

  getOption() {
    const option: EChartOption = {
      // title: {
      //   text : '料理売上利益統計表',
      //   left: 'center',
      // },
      legend: {
        right: 10,
        top: 30,
        // orient: 'vertical',
        data: ['利益']
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
          name: '売上',
          data: this.seriesData,
          type: 'line'
        }
      ]
    };
    return option;
  }

}
