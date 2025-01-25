import { Component, OnInit, ViewChild } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService } from 'app-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

const moment =  _moment;
import {FormControl} from '@angular/forms';
import { MasterGroup } from 'projects/restaurant/src/app/menu/menu.interface';
import { Master } from 'projects/guest/src/app/shared/master.interface';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-counter-manager',
  templateUrl: './counter-manager.component.html',
  styleUrls: ['./counter-manager.component.css'],
  
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class CounterManagerComponent implements OnInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;

  begin = new FormControl(moment());
  end = new FormControl(moment());
  paymethod = new FormControl();
  delete_al = new FormControl();
  delete_ns = new FormControl();
  receipt_al = new FormControl();
  receipt_ns = new FormControl();


  payMethodMaster: Array<Master> = [];
  count_amounts_actually = 0;
  count_amounts_payable = 0;


  dataSource = new MatTableDataSource<any>([]);

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private cmp: CmpService
  ) { 
  }

  ngOnInit() {
    this.json.get('master/master/', { name: 'pay_method' }).subscribe((group: Array<MasterGroup>) => {
      if (group && group[0]) {
        this.payMethodMaster = group[0].master_data;
      }
    });
  }

  ngAfterViewInit(): void {
    this.onSearch();
  }

  onSearch() {
    this.count_amounts_payable = 0;
    this.count_amounts_actually = 0;
    this.empty.refreshFlg = false;
    this.dataSource.data = [];
    this.selection.clear();

    let params = {};
    params["begin"] = this.begin.value ? this.begin.value.format(MY_FORMATS.parse.dateInput) : null;
    params["end"] = this.end.value ? this.end.value.format(MY_FORMATS.parse.dateInput) : null;
    params["paymethod"] = this.paymethod.value ? this.paymethod.value : null;
    params["receipt_al"] = this.receipt_al.value;
    params["receipt_ns"] = this.receipt_ns.value;

    params["delete_al"] = this.delete_al.value;
    params["delete_ns"] = this.delete_ns.value;


    this.json.post('s/counter/lists/', params).subscribe((response: JsonResult) => {
      if (response) {
        this.empty.refreshFlg = true;
        this.dataSource.data = response.data;
        this.count_amounts_payable = 0;
        this.count_amounts_actually = 0;
        this.dataSource.data.forEach((item) => {
          this.count_amounts_actually += item.amounts_actually;
          this.count_amounts_payable += item.amounts_payable;
        });
      }
    });
  }

  changeCheckbox(event: any){
    this.onSearch()
  }

  selectionChanges(event: any) {
    this.onSearch()
  }

  onDelete(detail) {
    this.cmp.confirm('選択されたデータを削除しますか？').afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.json.post('s/counter/delete', {id:detail.id}).subscribe((response: JsonResult) => {
          if (response) {
            this.cmp.pop(response.message);
            this.onSearch();
          }
        });
      }
    });
  }

  change(event, type) {
    type == "begin"
      ? this.begin.patchValue(event.value)
      : this.end.patchValue(event.value);
    this.onSearch();
  }
}
