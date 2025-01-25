import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JsonService, JsonResult, Util, PagingComponent, CmpService } from 'app-lib';
import { MatTableDataSource } from '@angular/material';
import { until } from 'protractor';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inventorycontrol',
  templateUrl: './inventorycontrol.component.html',
  styleUrls: ['./inventorycontrol.component.css']
})
export class InventorycontrolComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['parts_type', 'part_name', 'parts_inventory_qty', 'remarks'];

  @ViewChild(PagingComponent, { static: false }) paging: PagingComponent;

  // 検索フォーム
  searchForm: FormGroup;

  // 明細フォーム
  checkForm: FormGroup;
  
  // カテゴリー
  categories = [];
  catIds = [];

  // 材料名
  partNames = [];

  // 点検リスト
  check = [];

  // 明細フラグ
  checkflg = false;
  dataSize = 0;


  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private route: ActivatedRoute,
    private cmp: CmpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      parts_type: ['', []],
      part_name: ['', []]
    });

    this.checkForm = this.fb.group({
      id: ['', []],
      part_id: ['', []],
      parts_type: ['', []],
      parts_name: ['', []],
      part_unit: ['', []],
      parts_inventory_qty: ['', Validators.required],
      inspection_date: ['', Validators.required],
      inspector: ['', Validators.required],
      inspection_result_confirmation: ['', Validators.required],
      remarks: ['', []]

    });

    this.onCheckInfo();

    let param = { 'keyword' : this.catIds }
    this.getPartNames(param);

  }

  // スクロールロード試験
  ngAfterViewInit(): void {
    this.onSearch();
  }

  onCheckInfo() {
    this.json.post('s/s03p01/get_check_info/', {}).subscribe((response?: JsonResult) => {

      if (response.data) {
        this.check = response.data['rows'];
        this.categories = response.data['categories'];
      }

    });
  }

  onClear() {
    this.searchForm.reset();
  }

  onSearch() {

    // let params = Util.appendIf(this.searchForm.value, this.paging.getParam());
    let params = this.searchForm.value;
    this.dataSource.data = [];

    this.json.post('s/s03p01/get_inventorycontrol_data/', params).subscribe((response) => {

      if (response["data"]) {
        console.log(response["data"])
        this.dataSource.data = response["data"];
        // this.dataSize = response["data"].count;
      }
    });
  }

  getPartNames(params) {

    this.json.post('s/s03p01/get_ing_data/', params).subscribe((response?: JsonResult) => {

      if (response.data) {
        this.partNames = response.data;
      }

    });

  }

  onEdit() {
    // this.checkflg = true;
    this.router.navigate(['/store/check']);
  }

  offEdit() {
    this.checkForm.reset();
    this.checkflg = false;
  }

  onResult() {
    this.router.navigate(['/store/checkresult']);
  }

  onSave() {
    if (this.checkForm.valid) {
      let params = {};
      params = this.checkForm.value;
      this.json.post('s/s03p01/save_click/', params).subscribe((response) => {
        if (response) {
          this.cmp.pop(response['message']);
          // this.checkflg = false;
          this.checkForm.reset();
          this.onSearch();
        }
      });
    }
  }

  onDelete() {

    this.checkForm.reset();
  }

  onSelectPart(event) {
    // const index = this.check.findIndex(data => data['id'] === event.value);
    // if (index >= 0) {
      // const selectedCheck = this.check[index];
      this.checkForm.get('parts_type').setValue(event.value);
      // this.checkForm.get('part_unit').setValue(selectedCheck['part_unit']);
    // } else {
      // this.checkForm.get('parts_type').setValue('');
      // this.checkForm.get('part_unit').setValue('');
    // }
    this.catIds = [];

    this.categories.forEach(row => {
      if (row.id === event.value) {
        this.catIds.push(row.id);
      } else {
        if (row.parent_id === event.value) {
          this.catIds.push(row.id);
        }
      }
    });

    let param = { 'keyword' : this.catIds }
    this.getPartNames(param);
  }

}


