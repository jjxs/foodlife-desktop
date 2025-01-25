import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { JsonService, JsonResult, Util, PagingComponent, Const, CmpService } from 'app-lib';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-warehousing',
  templateUrl: './warehousing.component.html',
  styleUrls: ['./warehousing.component.css']
})
export class WarehousingComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [ 'order_number', 'receipt_number', 'part_name', 'base', 'supplier', 'remarks', 'button'];

  //検索ボタン押下フラグ
  flag: any;

  @ViewChild(PagingComponent, { static: false }) paging: PagingComponent;

  // 検索フォーム
  searchForm: FormGroup;

  // 明細フォーム
  warehouseForm: FormGroup;

  // 明細フラグ
  warehouseflg = false;
  dataSize = 0;
  deleteid: any;
  // 本日の日付
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private cmp: CmpService
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      receipt_date: ['', []],
      part_code: ['', []],
      part_name: ['', []],
      parts_type: ['', []]
    });

    this.warehouseForm = this.fb.group({
      id: ['', []],
      order_number: ['', []],
      receipt_number: ['', []],
      base: ['', []],
      receipt_id: ['', []],
      part_name: ['', []],
      parts_type: ['', []],
      part_unit: ['', []],
      supplier: ['', []],
      parts_unit_price_tax_inc: ['', []],
      parts_currency: ['', []],
      parts_receipt_qty: ['', []],
      receipt_status_confirmation: ['', []],
      receipt_parts_checker: ['', []],
      remarks: ['', []]
    });

  }
  /**
   * 検索
   */

  onSearch() {
    let params = Util.appendIf(this.searchForm.value, this.paging.getParam());
    this.dataSource.data = [];

    this.json.get('s/s01p01/get_data/', params).subscribe((response) => {

      if (response["data"]) {
        console.log(response["data"])
        this.dataSource.data = response["data"].rows;
        this.dataSize = response["data"].count;
      }
    });
  }

  onClear() {
    this.searchForm.reset();

  }
  onEdit(row) {
    this.warehouseflg = true;
    this.json.post('s/s01p01/get_detail_data/', { id: row['id'] }).subscribe((response?: JsonResult) => {
      if (response.data) {
        this.warehouseForm.patchValue(response.data);
      }
    });
  }
  onAddBase() {
    this.warehouseForm.reset();
  }
  onSave() {
    if (this.warehouseForm.valid) {
      let params = this.warehouseForm.value;
      this.json.post('s/s01p01/save_click/', params).subscribe((response) => {
        if (response) {
          this.cmp.pop(response['message']);
          this.warehouseflg = false;
          this.warehouseForm.reset();
        }
      });
    }
  }
  onAddnew() {
    this.warehouseflg = true;

  }


  onDelete() {
    let params = this.warehouseForm.value;
    this.json.post('s/s01p01/get_detail_delete_data/', params).subscribe((response?: JsonResult) => {
      if (response) {
        this.cmp.pop(response['message']);
        this.warehouseflg = false;
        this.warehouseForm.reset();
      }
    });
  }
}

