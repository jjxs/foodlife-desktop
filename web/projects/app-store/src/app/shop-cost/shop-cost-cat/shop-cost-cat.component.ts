import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-shop-cost-cat',
  templateUrl: './shop-cost-cat.component.html',
  styleUrls: ['./shop-cost-cat.component.css']
})
export class ShopCostCatComponent implements OnInit, AfterViewInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  searchForm: FormGroup;

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  // テーブル
  displayedColumns = ['category_name', 'button'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
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
    this.json.post('s/shop_cost_api/get_cat_data', {}).subscribe((response: JsonResult) => {
      if (response) {
        this.empty.refreshFlg = true;
        this.dataSource.data = response.data;
      }
    });
  }

  onEdit(row) {
    this.edit.emit(row.id);
  }

  onMove(item) {
    const params = {
      rows: this.selection.selected,
      parent_id: item || null
    };

    this.json.post('s/shop_cost_api/move_cat_data', params).subscribe((response: JsonResult) => {
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

  onDelete(row) {
    this.cmp.confirm('選択されたカテゴリーを削除しますか？').afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.doDelete(row);
      }
    });
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

    this.json.post('s/shop_cost_api/delete_cat_data', params).subscribe((response: JsonResult) => {
      if (response.result) {
        this.cmp.pop(response.message);
        this.onSearch();
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
