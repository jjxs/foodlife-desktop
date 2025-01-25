import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { UserAddGroupComponent } from './user-add-group/user-add-group.component'
import { UserEditGroupComponent } from './user-edit-group/user-edit-group.component'

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css']
})
export class UserGroupComponent implements OnInit, AfterViewInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  searchForm: FormGroup;

  menuList = {
      'counter': '/counter',
      'menu': '/menu/',
      'seats': '/seats',
      'order': '/order',
      'kitchen': '/kitchen',
      'settings': '/settings',
      'manager': '/manager',
      'menumgmt': '/store/menu-mgmt',
      'ingredients': '/store/ingredients',
      'inventorycontrol': '/store/inventory-control',
      'shopcost': '/store/shop-cost',
      'charts': '/charts',
      'usermanager': '/store/user-manager',
      'usergroup': '/store/user-group',
      'payment': '/store/payment',
      'setsubimanager': '/store/setsubi-manager',
      'staff': '/staff'
    };

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
    this.json.post('s/user_group_api/get_group_data', params).subscribe((response: JsonResult) => {
      if (response) {
        this.empty.refreshFlg = true;
        this.dataSource.data = response.data;
      }
    });
  }

  onEdit(event) {
    this.catFlg = false;
    const dialog = this.dialog.open(UserEditGroupComponent, {
      width: '850px',
      height: '765px',
      data: {event: event, menuList: this.menuList}
    });
    dialog.afterClosed().subscribe(result => {
      if (result == '1') {
        this.onSearch();
      }
    });
  }

  onAdd() {
    const dialog = this.dialog.open(UserAddGroupComponent, {
      width: '850px',
      height: '765px',
      data: { menuList: this.menuList }
    });
    dialog.afterClosed().subscribe(result => {
      if (result == '1') {
        this.onSearch();
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
      if (response.result) {
        this.cmp.pop(response.message);
        this.onSearch();
      }
    });
  }

  delGroup(row) {
    this.cmp.confirm('選択されたグループを削除しますか？').afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.json.post('s/user_group_api/del_group_data', row).subscribe((response: JsonResult) => {
          if (response.result) {
            this.cmp.pop(response.message);
            this.onSearch();
          }
        });
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numParents = this.dataSource.data.length;
    let numChildren = 0;
    this.dataSource.data.forEach(row => numChildren += row.children.length);
    return (numParents + numChildren) === numSelected;
  }

  hasChildrenSelected(parent) {
    let result = false;
    for (const child of parent.children) {
      result = this.selection.isSelected(child);
      if (result) { break; }
    }

    return result;
  }

  parentToggle(parent) {
    if (this.selection.isSelected(parent)) {
      this.selection.deselect(parent);
      parent.children.forEach(child => this.selection.deselect(child));
    } else {
      this.selection.select(parent);
      parent.children.forEach(child => this.selection.select(child));
      parent['display'] = 'table-row';
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.children.forEach(child => this.selection.select(child));
        row['display'] = 'table-row';
      });
  }
}
