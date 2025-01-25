import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-takeout-order',
  templateUrl: './takeout-order.component.html',
  styleUrls: ['./takeout-order.component.css']
})
export class TakeoutOrderComponent implements OnInit, AfterViewInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  searchForm: FormGroup;

  // テーブル
  dataSource = new MatTableDataSource<any>([]);

  security_key;

  constructor(
    private jsonSrv: JsonService,
    private cmp: CmpService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      keywordaddress: '',
      keyworduser: '',
    });
  }

  ngAfterViewInit(): void {
    this.onSearch();
  }

  onSearch() {
    this.empty.refreshFlg = false;
    this.dataSource.data = [];
    const params = this.searchForm.value;
    this.jsonSrv.post('s/takeout_order_api/get_takeout_history', params).subscribe((response: JsonResult) => {
      if (response) {
        this.empty.refreshFlg = true;
        this.dataSource.data = response.data;
      }
    });
  }

  // 展開・折り畳む
  onToggle(group) {
    if (group['display'] === 'none') {
      group['display'] = 'table-row';
    } else {
      group['display'] = 'none';
    }
  }

  sendOrder(event, parent) {
    const data = [];
    const seat_id = parent['seat_no'];
    parent['details'].forEach((menu) => {
      if (menu.count > 0) {
          data.push({
              count: menu.count,
              free: 0,
              menu: {
                'id': menu['menu_id'],
                'menu_options': []
              }
          });
      }
    });
    event.disabled = true;
    const ship_info = {
      'ship_addr': parent['ship_addr'],
      'ship_name': parent['ship_name'],
      'ship_tel': parent['ship_tel'],
      // tslint:disable-next-line: max-line-length
      'ship_time': (new Date(parent['ship_time']).toLocaleDateString()) + ' ' + (new Date(parent['ship_time']).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    };

    this.jsonSrv.post('restaurant/seat_status', { id: seat_id }).subscribe((response?: JsonResult) => {
      if (!Util.isEmpty(response)) {
        this.jsonSrv.get('master/seatstatus/', { seat: seat_id }).subscribe((response) => {
          if (response && response[0]) {
            const params = {
              'orders': data,
              'key': response[0].security_key,
              'ship_info': ship_info
          };

          this.jsonSrv.post('restaurant/order/order/', params).subscribe((response) => {
              if (response && response['message']) {
                  this.cmp.pop(response['message']);
                  this.jsonSrv.post('s/takeout_order_api/order', {'id': parent['id']}).subscribe((response) => {
                    this.onSearch();
                  });
              }
          });
          }
        });
      }
    });

  }
}


