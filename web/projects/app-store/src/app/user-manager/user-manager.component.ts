import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { UserEditManagerComponent } from './user-edit-manager/user-edit-manager.component';
import { UserAddManagerComponent } from './user-add-manager/user-add-manager.component';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit, AfterViewInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  searchForm: FormGroup;

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  // テーブル
  displayedColumns = ['cat_name', 'explanation', 'button'];
  dataSource = new MatTableDataSource<any>([]);
  // カテゴリーフラグ
  catFlg = false;
  // カテゴリー編集データ
  catData = {};

  constructor(
    private dialog: MatDialog,
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      keyword: ''
    });
  }

  ngAfterViewInit(): void {
    this.onSearch();
  }

  onSearch() {
    this.empty.refreshFlg = false;
    this.dataSource.data = [];
    this.selection.clear();
    const params = {
      keyword: this.searchForm.get('keyword').value
    };
    this.json.post('s/user_manager_api/get_user_data', params).subscribe((response: JsonResult) => {
      if (response) {
        this.empty.refreshFlg = true;
        this.dataSource.data = response.data;
      }
    });
  }

  onEdit(event) {
    this.catFlg = false;
    const dialog = this.dialog.open(UserEditManagerComponent, {
      width: '700px',
      height: '520px',
      data: event
    })
    dialog.afterClosed().subscribe(result => {
      if (result == "1") {
        this.onSearch()
      }
    });
  }

  onAdd() {
    const dialog = this.dialog.open(UserAddManagerComponent, {
      width: '700px',
      height: '520px',
    })
    dialog.afterClosed().subscribe(result => {
      if (result == "1") {
        this.onSearch()
      }
    });
  }

  onMove(item) {
    const params = {
      rows: this.selection.selected,
      parent_id: item || null
    };

    this.json.post('s/ingredients_api/move_cat_data', params).subscribe((response: JsonResult) => {
      if (response.message) {
        this.cmp.pop(response.message);
        this.onSearch();
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

  onDelete(row?) {
    if (row) {
      this.cmp.confirm('選択されたカテゴリーを削除しますか？').afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.doDelete(row);
        }
      });
    } else {
      this.cmp.confirm('選択されたカテゴリーを削除しますか？').afterClosed().subscribe(result => {
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

    this.json.post('s/user_manager_api/delete_cat_data', params).subscribe((response: JsonResult) => {
      if (response.result != undefined) {
        this.cmp.pop(response.message);
        this.onSearch();
      } else {
        this.cmp.pop("削除できませんでした");
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
