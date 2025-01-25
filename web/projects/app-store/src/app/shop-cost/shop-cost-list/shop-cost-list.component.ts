import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { JsonService, JsonResult, CmpService, TableEmptyMessageComponent, Util } from 'app-lib';
import { MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-shop-cost-list',
  templateUrl: './shop-cost-list.component.html',
  styleUrls: ['./shop-cost-list.component.css']
})
export class ShopCostListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;

  @Output() edit = new EventEmitter<any>();

  // 検索フォーム
  searchForm: FormGroup;
  // カテゴリー
  categories = [];
  // 絞り込みカテゴリー
  filterCat = [];
  childrenCat = [];
  // 絞り込みセレクション
  parentSelection = new SelectionModel<any>(true, []);
  filterSelection = new SelectionModel<any>(true, []);
  // フィルター画面フラグ
  filterFlg = false;
  // テーブル
  displayedColumns = ['cost_name', 'category_name', 'cost', 'pay_time', 'button'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  constructor(
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
    this.filterFlg = false;
    this.dataSource.data = [];
    const params = {
      keyword: this.searchForm.get('keyword').value,
      filter: this.filterSelection.selected
    };
    this.json.post('s/shop_cost_api/get_ing_data', params).subscribe((response: JsonResult) => {
      if (response) {
        this.dataSource.data = response.data.rows;
        this.categories = response.data.categories;
        this.filterCat = response.data.filter_cat;
        this.empty.refreshFlg = true;
        this.filterSelection.clear();
      }
    });
  }

  onEdit(row) {
    this.edit.emit(row.id);
  }

  onFilter() {
    this.filterFlg = !this.filterFlg;
  }

  onDelete(row?) {
    if (row) {
      const name = row.cost_name;
      this.cmp.confirm(`費用「${name}」削除しますか？`).afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.doDelete(row);
        }
      });
    } else {
      this.cmp.confirm('選択された費用を削除しますか？').afterClosed().subscribe(result => {
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

    this.json.post('s/shop_cost_api/delete_ing_data', params).subscribe((response: JsonResult) => {
      if (response) {
        this.cmp.pop(response.message);
        this.onSearch();
      }
    });
  }

  onMove(item) {
    const params = {
      rows: this.selection.selected,
      ing_cat_id: item
    };
    this.json.post('s/shop_cost_api/move_ing_data', params).subscribe((response: JsonResult) => {
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

  parentToggle(item) {
    if (this.filterSelection.isSelected(item.id)) {
      this.filterSelection.deselect(item.id);
      this.filterCat.forEach(row => {
        this.childrenCat = row.children;
        this.childrenCat.forEach(child => {
          if (child.parent_id === item.id) {
            if (this.filterSelection.isSelected(child.id)) {
              this.filterSelection.deselect(child.id);
            }
          }
        });
      });
      // item.children.array.forEach(child => {
      //   if (!this.filterSelection.isSelected(child.id)) {
      //     this.filterSelection.select(child.id);
      //   }
      // });
    } else {
      this.filterSelection.select(item.id);
      this.filterCat.forEach(row => {
        this.childrenCat = row.children;
        this.childrenCat.forEach(child => {
          if (child.parent_id === item.id) {
            if (!this.filterSelection.isSelected(child.id)) {
              this.filterSelection.select(child.id);
            }
          }
        });
      });
    }
  }

  childToggle(event, item, child) {
    if (event.checked) {
      this.filterSelection.toggle(child.id);
      if (this.filterSelection.isSelected(item.id) && !this.filterSelection.isSelected(child.id)) {
        this.filterSelection.select(child.id);
      }
    } else {
      if (this.filterSelection.isSelected(item.id) && this.filterSelection.isSelected(child.id)) {
        this.filterSelection.deselect(child.id);
      }
    }
  }

  childCheck(item, child) {
    if (this.filterSelection.isSelected(item.id)) {
      return false;
    } else {
      return this.filterSelection.isSelected(child.id);
    }
  }
}
