import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChartsService } from '../charts.service';
import { MatDialog } from '@angular/material';
import { CounterService } from '../../counter/counter.service';
import { EChartOption } from 'echarts';
import { AuthenticationService, JsonService, Util, JsonResult} from 'ami';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
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
  selector: 'restaurant-chart-top',
  templateUrl: './chart-top.component.html',
  styleUrls: ['./chart-top.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ChartTopComponent implements OnInit {
  seriesData = [];
  xAxisData  = [];
  legendData = [];
  dataSource;

  displayedColumns: string[] = ['name', 'cost'];

  current_month = '';
  counterData = [];
  showChartsMenu = false;
  showTodayPie = false;

  chartOption: EChartOption;
  todayPieOption: EChartOption;
  chartMenusOption: EChartOption;


  date = new FormControl(moment());

  constructor(
    private jsonSrv: JsonService,
    public counterSrv: CounterService) { 
      this.getCounterDetail();
      this.getData();
      this.getChartsMenu();
    }

  ngOnInit() {
  }

  getData() {
    const params = {};
    params['year'] = this.date.value.year();
    params['month'] = this.date.value.month() + 1;
    this.current_month = params['year'] + '/' + params['month'];
    const max_day = (new Date(params['year'], params['month'], 0)).getDate();
    const seriesData = [];
    this.seriesData  = [];
    this.xAxisData = [];
    for ( let i = 1; i <= max_day; i++ ) {
      this.xAxisData.push( new Date(this.current_month + '/' + i).toLocaleDateString());
      seriesData.push(0);
    }
    this.getSaleCount(max_day, params, Util.copy(seriesData));
    this.getCost(max_day, params, Util.copy(seriesData));
  }

  getCost(max_day, params, seriesData) {
    const dataSource = [];
    this.jsonSrv.post('restaurant/charts/cost/', params).subscribe((response: any) => {

      if (!Util.isEmpty(response)) {
        response.forEach(element => {
          const index = (new Date(element['pay_time']).getDate()) - 1;
          const key = element['category_name'];
          if (Util.isEmpty(dataSource[key])) {
            dataSource[key] = {
              'name': key,
              'cost': 0
            };
          }
          dataSource[key]['cost'] += element['cost'];

          for ( let i = index; i <= max_day; i++ ) {
            seriesData[i] += element['cost'];
          }
        });

        const data = [];
        // tslint:disable-next-line: forin
        for ( const i in dataSource ) {
          data.push(dataSource[i]);
        }

        this.dataSource = new MatTableDataSource(data);

        this.seriesData.push(
          {
            name: '成本',
            data: seriesData,
            type: 'line'
          }
        );
        this.legendData.push('成本');
        this.chartOption = this.getOption();

      }
    });
  }

  getSaleCount(max_day, params, seriesData) {
    this.jsonSrv.post('restaurant/counter/sale_count/', params).subscribe((response) => {

      if (!Util.isEmpty(response) && !Util.isEmpty(response['data'])) {
        const days = response['data']['days'];
        days.forEach(element => {
          const index = (new Date(element['day']).getDate()) - 1;
          for ( let i = index; i <= max_day; i++ ) {
            seriesData[i] += element['amounts_actually'];
          }
        });
        this.seriesData.push(
          {
            name: '売上',
            data: seriesData,
            type: 'line'
          }
        );
        this.legendData.push('売上');
        this.chartOption = this.getOption();
        this.todayPieOption = this.getTodayPieOption();
      }
    });
  }

  getOption() {
    const option: EChartOption = {
      // title: {
      //   text : '売上統計表',
      //   left: 'center',
      // },
      legend: {
        right: 10,
        top: 30,
        // orient: 'vertical',
        data: this.legendData
      },
      tooltip: {
        trigger: 'axis',
      //   formatter: this.current_month + '/{b0}<br />{a0}: {c0}'
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
      series: this.seriesData
    };
    return option;
  }

  format(amount) {
    const formatter = new Intl.NumberFormat('ja-JP');
    return '￥' + formatter.format(amount);
  }
  
  getTodayPieOption() {
    const option: EChartOption = {
        title: {
          text: '本日売上',
          // subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter:  function (params, ticket, callback) {
              const formatter = new Intl.NumberFormat('ja-JP');
              return params.seriesName + ' <br/>' + params.name + ' : ￥' + formatter.format(params.value) + '(' + params.percent + '%) ' +
                    '<br />総売上：￥' + formatter.format(params.data['total']) 
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['ランチ', 'ディナー']
        },
        series: [
            {
                name: '売上',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: this.counterData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],
        color: ['#d48265', '#2f4554']
    };
    console.info(this.counterData)
    return option;
  }


  
  getCounterDetail() {
    const d = new Date();
    const params = {};
    params['year'] = d.getFullYear();
    params['month'] = d.getMonth() +1;
    params['day'] = d.getDate();
    let counter_paylist = {
      '0': {
        'name': 'ランチ',
        'amount': 0,
      },
      '1': {
        'name': 'ディナー',
        'amount': 0,
      },
    };

    // 注文明細を取得
    this.jsonSrv.post('restaurant/counter/counter_detail/', params).subscribe((response?) => {
      if ( !Util.isEmpty(response) ) {
        if ( !Util.isEmpty(response['data']) ) {
          let del_map  = {};
          response['data']['counters'].forEach((item)=>{
            if ( item['delete']==true ) {
              del_map[item['id']] = 1;
            }
          });
          response['data']['counter_details'].forEach((item)=>{
            if ( Util.isEmpty(item['canceled']) && Util.isEmpty(del_map[item['counter_id']]) ) {
              
              if ( item['lunch']==1 ) {
                counter_paylist['0']['amount'] += item['amounts_actually'];
              } else {
                counter_paylist['1']['amount'] += item['amounts_actually'];
              }
              if ( Util.isEmpty(counter_paylist[item['pay_method_id']]) ) {
                // tslint:disable-next-line: no-unused-expression
                counter_paylist[item['pay_method_id']] = {
                  'name': item['display_name'],
                  'amount': item['amounts_actually']
                };
              } else {
                counter_paylist[item['pay_method_id']]['amount'] += item['amounts_actually'];
              }
            }
          });
        }
      }

      this.counterData = [
        {value: counter_paylist['0']['amount'], name: counter_paylist['0']['name'], total:(counter_paylist['0']['amount'] + counter_paylist['1']['amount'])},
        {value: counter_paylist['1']['amount'], name: counter_paylist['1']['name'], total:(counter_paylist['0']['amount'] + counter_paylist['1']['amount'])}
      ];
    
      this.showTodayPie = true;
      console.info(this.counterData)
    });
    return counter_paylist;
  }


  getChartsMenu() {
    let d = new Date();
    const start_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.jsonSrv.get('restaurant/charts/menu/', { 'start_date': start_date, 'end_date': start_date }).subscribe((response?: any) => {
      if (!Util.isEmpty(response)) {
        let arr = [];
        const legendData = [];
        response.forEach((element: any) => {
          arr.push({
            'name': element['menu_name'],
            'value': element['total'],
            'total_price': element['total_price']
          })
          // legendData.push(element['menu_name']);
        });
        arr.sort(function (a, b) {
          return (b['value']-a['value']);
        });

        let seriesData = [];
        let otherSeriesData = {
          'name': 'Top10から~',
          'value': 0,
          'total_price': 0
        };
        arr.forEach((item)=> {
          if ( seriesData.length<10 ) {
            seriesData.push(item);
          } else {
            otherSeriesData['value'] += item['value'];
            otherSeriesData['total_price'] += item['total_price'];
          }
        })
        seriesData.push(otherSeriesData);

        this.showChartsMenu = true;
        this.chartMenusOption = {
          title: {
            text: 'メユー注文数量',
            left: 'center'
          },
          tooltip: {
              trigger: 'item',
              formatter:  function (params, ticket, callback) {
                const formatter = new Intl.NumberFormat('ja-JP');
                return params.name + ' <br /><br /> 総数量: ' + params.value + '個 (' + params.percent + '%)' +
                        '<br /> 総金額: ￥' + formatter.format(params.data['total_price']) + ' (税抜)'
              }
          },
          series: [
              {
                  name: '注文数量',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '50%'],
                  data: seriesData,
                  emphasis: {
                      itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ],
        };
      }
    });
  }
  chosenYearHandler(normalizedYear) {
    const ctrlValue = this.date.value;
    // ctrlValue.year(normalizedYear.year());
    ctrlValue.year((new Date(normalizedYear)).getFullYear());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth, datepicker) {
    const ctrlValue = this.date.value;
    // ctrlValue.month(normalizedMonth.month());
    ctrlValue.month((new Date(normalizedMonth)).getMonth());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.getData();
  }

}
