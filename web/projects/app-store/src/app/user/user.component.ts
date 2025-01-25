import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserAddComponent } from './user-add/user-add.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  searchForm: FormGroup;

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  // テーブル
  dataSource = new MatTableDataSource<any>([]);

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
    this.json.post('s/user_api/get_user_data', params).subscribe((response: JsonResult) => {
      if (response) {
        this.empty.refreshFlg = true;
        this.dataSource.data = response.data;
      }
    });
  }

  onEdit(event) {
    const dialog = this.dialog.open(UserEditComponent, {
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
    const dialog = this.dialog.open(UserAddComponent, {
      width: '700px',
      height: '520px',
    })
    dialog.afterClosed().subscribe(result => {
      if (result == "1") {
        this.onSearch()
      }
    });
  }

  onDelete(id?) {
    if (id) {
      this.cmp.confirm('選択された会員を削除しますか？').afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.doDelete(id);
        }
      });
    } else {
      this.cmp.confirm('選択された会員を削除しますか？').afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.doDelete(this.selection.selected);
        }
      });
    }

  }

  doDelete(id) {
    
    let params = {};
    params['id'] = id;

    this.json.post('s/user_api/delete_user', params).subscribe((response: JsonResult) => {
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
