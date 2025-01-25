import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { JsonService, JsonResult, CmpService, TableEmptyMessageComponent, Util } from 'app-lib';
import { MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;

  @Output() edit = new EventEmitter<any>();

  // テーブル
  displayedColumns = ['sup_name', 'sup_tel', 'sup_addr', 'button'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private cmp: CmpService,
    private fb: FormBuilder,
    private json: JsonService
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.onSearch();
  }

  public onSearch() {
    this.empty.refreshFlg = false;
    this.dataSource.data = [];
    const params = {
    };
    this.json.post('s/shop_cost_api/get_supplier', params).subscribe((response: JsonResult) => {
      if (response) {
        this.dataSource.data = response.data;
      }
    });
  }

  onEdit(row) {
    this.edit.emit(row);
  }


  onDelete(row?) {
    if (row) {
      const name = row.sup_name;
      this.cmp.confirm(`「${name}」削除しますか？`).afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.doDelete(row);
        }
      });
    }
  }

  doDelete(row) {
    let params = {
      id : row.id
    };
    this.json.post('s/shop_cost_api/del_supplier', params).subscribe((response: JsonResult) => {
      this.onSearch();
    });

  }

}
