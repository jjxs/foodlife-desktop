import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { PagingComponent, JsonService, Util, CmpService } from 'app-lib';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-ordering-table',
  templateUrl: './ordering-table.component.html',
  styleUrls: ['./ordering-table.component.css']
})
export class OrderingTableComponent implements OnInit {
  displayedColumns: string[] = ['part_name', 'parts_type', 'parts_unit_price', 'parts_currency',
    'parts_qty', 'supplier', 'remarks', 'button'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('fileInput', { static: true }) fileInput;

  // 発注フォーム
  OrderForm: FormGroup;

  // 発注明細フォーム
  DetailsForm: FormGroup;

  // 明細フラグ
  orderingflg = false;

  // テーブルデータ
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private cmp: CmpService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.OrderForm = this.fb.group({
      order_date: ['', Validators.required],
      order_number: ['', Validators.required],
      orderer: ['', Validators.required],
      order_address: ['', Validators.required],
      order_phone_number: ['', Validators.required],
      order_summary: ['', Validators.required]

    })

    this.DetailsForm = this.fb.group({
      part_id: ['', []],
      part_name: ['', Validators.required],
      parts_type: ['', Validators.required],
      parts_unit_price: ['', Validators.required],
      parts_currency: ['', Validators.required],
      parts_qty: ['', Validators.required],
      supplier: ['', Validators.required],
      remarks: ['', Validators.required]
    });

    this.dataSource.sort = this.sort;
    // 遷移元画面判断
    const orderdetail = this.route.snapshot.queryParamMap.get('id');
    if (orderdetail) {
      this.onSearch(orderdetail);
    } else {
      this.onAddNew();
    }

  }
  // 画面初期表示
  onSearch(data) {
    this.dataSource.data = [];

    this.json.get('s/s02p02/get_detail_data/', { id: data }).subscribe((response) => {

      if (response["data"]) {
        console.log(response["data"])
        this.dataSource.data = response["data"];
      }
    });
  }

  onAddNew() {
    this.orderingflg = true;
  }


  onOrder() {
    if (this.OrderForm.valid) {
      let params = {};
      params["rows"] = this.dataSource.data;
      params["OrderForm"] = this.OrderForm.value;
      this.json.post('s/s02p02/set_orderdetail/', params).subscribe((response) => {
        if (response) {
          this.cmp.pop(response['message']);
          this.orderingflg = false;
          this.dataSource.data = [];
          this.router.navigate(['/store/ordering']);
        }
      });
    }
  }

  onSave() {
    if (this.DetailsForm.valid) {
      let array = [];
      array = Util.clone(this.dataSource.data);
      const tmp = this.DetailsForm.value;
      array.push(tmp);
      this.dataSource.data = array;
      this.DetailsForm.reset();
      this.orderingflg = true;
    }
  }

  onClear() {

    this.OrderForm.reset();

  }

  // onDelete(item, index) {
  //   if (index === this.currentId) {
  //    this.DetailsForm();
  //   }
  //   const itemIndex = this.gridData.findIndex((val) => val === item);
  //   if (this.gridData[itemIndex]['ID']) {
  //     this.deleteData.push(this.gridData[itemIndex]['ID']);
  //   }
  //   const array = this.gridData;
  //   array.splice(itemIndex, 1);
  //   this.gridData = Util.clone(array);
  //   console.log("onDelete", this.gridData);
  }


