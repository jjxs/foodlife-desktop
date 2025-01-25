import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { JsonService, JsonResult, Util, PagingComponent, CmpService } from 'app-lib';
import { MatTableDataSource, MatSort } from '@angular/material';
import { until } from 'protractor';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { FnParam } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-checkresult',
  templateUrl: './checkresult.component.html',
  styleUrls: ['./checkresult.component.css']
})
export class CheckresultComponent implements OnInit {

  @ViewChild(PagingComponent, { static: false }) paging: PagingComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // @Output() edit = new EventEmitter<any>();

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  displayedColumns: string[] = ['select', 'parts_type', 'part_name',
    'parts_inventory_qty', 'remarks'];

  // 明細フォーム
  resultForm: FormGroup;

  dataSize = 0;


  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private route: ActivatedRoute,
    private cmp: CmpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {

    this.json.post('s/s03p02/get_result_data/', {}).subscribe((response) => {

      if (response["data"]) {
        // console.log(response["data"])
        this.dataSource.data = response["data"];
      }
    });
  }
  onSave() {

    let params = {};
    params['rows'] = this.selection.selected;
    this.json.post('s/s03p02/save_click/', params).subscribe((response) => {
      if (response) {
        this.cmp.pop(response['message']);
        this.selection.clear();
        this.onSearch();
      }
    });
  }

  // 前の画面に戻る
  onCancel() {
    // this.resultForm.reset();
    // this.edit.emit(false);
    this.router.navigateByUrl('/store/inventory-control');
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
