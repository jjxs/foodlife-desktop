import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { JsonService, JsonResult, CmpService, TableEmptyMessageComponent, Util } from 'app-lib';
import { MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { PaymentEditComponent } from './payment-edit/payment-edit.component';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;

  @Output() edit = new EventEmitter<any>();

  // 検索フォーム
  searchForm: FormGroup;
  // 編集データ
  ingData = {};
  // テーブル
  displayedColumns = [ 'name', 'display_name', 'display_order', 'button'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  constructor(
    private dialog: MatDialog,
    private jsonSrv: JsonService,

    private cmp: CmpService,
    private fb: FormBuilder,
    private json: JsonService
  ) { }

    ngOnInit() {
        this.dataSource.sort = this.sort;
        this.searchForm = this.fb.group({
          keyword: ''
        });
    }

    ngAfterViewInit(): void {
        this.onSearch();
    }
    
    onSearch() {
        this.empty.refreshFlg = false;
        this.selection.clear();
        this.dataSource.data = [];
        const params = {
          keyword: this.searchForm.get('keyword').value
        };
        this.json.post('s/payment_api/get_ing_data', params).subscribe((response: JsonResult) => {
          if (response) {
            this.dataSource.data = response.data;
            this.empty.refreshFlg = true;
          }
        });
    }

  onEdit(row) {
    this.edit.emit(row.id);
    const dialog = this.dialog.open(PaymentEditComponent, {
        width: '850px',
        height: '580px',
        data: row
      })
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.onSearch()
        }
      });
  }

  onRefresh() {
    this.onSearch();
  }  

  onEditIng(event) {
    if (typeof event === 'boolean') {
      if (event) {
        //this.json.post('s/payment_api/get_edit_data', {}).subscribe((response: JsonResult) => {
          //if (response.data) {
            // this.ingData = {
            //   categories: response.data.categories
            // };
            const dialog = this.dialog.open(PaymentEditComponent, {
              width: '850px',
              height: '580px',
              data: this.ingData,
            })
            dialog.afterClosed().subscribe(result => {
              if(result){
                this.onRefresh();
              }
            });
          //}
        //});
      }
    } else {
      this.json.post('s/payment_api/get_edit_data', { id: event }).subscribe((response: JsonResult) => {
        if (response.data) {
          this.ingData = {
            result: response.data.result,
            categories: response.data.categories
          };
        }
        const dialog = this.dialog.open(PaymentEditComponent, {
          width: '850px',
          height: '580px',
          data: this.ingData
        })
        dialog.afterClosed().subscribe(result => {
          if(result){
            this.onRefresh();
          }
        });
      });
    }
  }

  onDelete(row?) {
    if (row) {
      const name = row.name;
      this.cmp.confirm(`支払方法「${name}」削除しますか？`).afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.doDelete(row);
        }
      });
    } else {
      this.cmp.confirm('選択された支払方法を削除しますか？').afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.doDelete(this.selection.selected);
        }
      });
    }
  }

  doDelete(row) {
    let deleteData = [];

    if (Util.isArray(row)) {
      deleteData = Util.clone(row);
    } else {
      deleteData.push(row);
    }

    const params = {
      rows: deleteData
    };

    this.json.post('s/payment_api/delete_ing_data', params).subscribe((response: JsonResult) => {
      if (response) {
        this.cmp.pop(response.message);
        this.onSearch();
      }
    });
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