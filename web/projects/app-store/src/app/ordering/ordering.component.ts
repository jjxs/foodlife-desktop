import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { PagingComponent, JsonService, Util, CmpService } from 'app-lib';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.css']
})
export class OrderingComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // 発注フォーム
  oderingForm: FormGroup;

  // 発注明細
  oderingCount = null;


  displayedColumns: string[] = ['order_date', 'order_number', 'orderer', 'order_address', 'order_phone_number', 'order_summary'];
  dataSource = new MatTableDataSource<any>([]);
  dataSize: any;



  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private cmp: CmpService,
    private router: Router
  ) { }

  ngOnInit() {

    this.oderingForm = this.fb.group({
      order_date: ['', []],
      order_number: ['', []]
    });

    this.dataSource.sort = this.sort;
    this.onSearch();

  }
  // 画面初期表示
  onSearch() {
    this.dataSource.data = [];
    const params = this.oderingForm.value;

    this.json.get('s/s02p01/get_data/', params).subscribe((response) => {

      if (response["data"]) {
        console.log(response["data"])
        this.dataSource.data = response["data"];
      }
    });
  }

  onClear() {
    this.oderingForm.reset();
    this.dataSource.data = [];
  }

  // onSelectOrdering(odering) {
  //   this.router.navigate(
  //     ['/store/ordering-table'],
  //     { queryParams: { number: odering }, skipLocationChange: true }
  //   );

  // }
  onAddnew(id) {
    this.router.navigate(['/store/ordering-table'],
      { queryParams: { id } }
    );


  }
}







