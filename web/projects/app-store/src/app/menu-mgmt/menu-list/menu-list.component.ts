import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TableEmptyMessageComponent, JsonResult, CmpService, JsonService, Util } from 'app-lib';
import { MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit, AfterViewInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() edit = new EventEmitter<any>();

  // no delete func menu
  desabledDeleteMenuNo = [];

  // カテゴリー情報
  category = [];
  // 検索用カテゴリー
  filterCat = [];
  childrenCat = [];
  // 検索フォーム
  searchForm: FormGroup;

  // テーブル
  displayedColumns = ['no', 'name', 'price', 'tax_in', 'usable', 'takeout', 'button'];
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  // カテゴリー移動セレクション
  // moveSelection = new SelectionModel<any>(true, []);
  // フィルターセレクション
  filterSelection = new SelectionModel<any>(true, []);
  parentSelection = new SelectionModel<any>(true, []);
  // フィルター画面フラグ
  filterFlg = false;

  constructor(
    private fb: FormBuilder,
    private cmp: CmpService,
    private json: JsonService
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.searchForm = this.fb.group({
      keyword: ''
    });
  }

  // スクロールロード試験
  ngAfterViewInit(): void {
    this.onSearch();
  }

  onSearch() {
    this.empty.refreshFlg = false;
    this.filterFlg = false;
    this.dataSource.data = [];
    // this.dataSource.sort = this.sort;
    this.selection.clear();
    const params = {
      keyword: this.searchForm.get('keyword').value,
      filter: this.filterSelection.selected
    };
    this.json.post('s/menu_mgmt_api/get_menu_data/', params).subscribe((response?: JsonResult) => {
      if (response) {
        this.dataSource.data = response.data.menu;
        this.category = response.data.category;
        this.filterCat = response.data.filter_cat;
        this.desabledDeleteMenuNo = response.data.desabled_delete_menu_no;
        this.empty.refreshFlg = true;
      }
    });
  }

  onEditMenu(row) {
    this.edit.emit(row.id);
  }

  onFilter() {
    this.filterFlg = !this.filterFlg;
  }

  canDel(row) {
    return this.desabledDeleteMenuNo.indexOf(row['no'])==-1;
  }

  // onMove(item?) {
  //   let menuCat = [];
  //   if (item) {
  //     menuCat.push(item);
  //   } else {
  //     menuCat = this.moveSelection.selected;
  //   }
  //   const params = {
  //     rows: this.selection.selected,
  //     menu_category: menuCat
  //   };
  //   this.json.post('s/menu_mgmt_api/move_menu', params).subscribe((response: JsonResult) => {
  //     if (response) {
  //       this.cmp.pop(response.message);
  //     }
  //   });
  // }

  onDelete(row?) {
    if (row) {
      const name = row.name;
      this.cmp.confirm(`メニュー「${name}」削除しますか？`).afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.doDelete(row);
        }
      });
    } else {
      this.cmp.confirm('選択されたメニューを削除しますか？').afterClosed().subscribe(result => {
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

    this.json.post('s/menu_mgmt_api/delete_menu_data/', params).subscribe((response: JsonResult) => {
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
    if (event) {
      this.filterSelection.toggle(child.id);
      if (this.filterSelection.isSelected(item.id) && !this.filterSelection.isSelected(child.id)) {
        this.filterSelection.select(child.id);
      }
    }
    // if (event && this.filterSelection.isSelected(item.id)) {
    //   if (!this.filterSelection.isSelected(child.id)) {
    //     this.filterSelection.select(child.id);
    //   }
    // }
    // if (event && !this.filterSelection.isSelected(item.id)) {
    //   this.filterSelection.toggle(child.id);
    // }
    // if (!event && this.filterSelection.isSelected(item.id)) {
    //   if (!this.filterSelection.isSelected(child.id)) {
    //     this.filterSelection.select(child.id);
    //   }
    // }
  }

  childCheck(item, child) {
    // if (this.filterSelection.isSelected(item.id) && !this.filterSelection.isSelected(child.id)) {
    //   this.filterSelection.select(child.id);
    // }
    return this.filterSelection.isSelected(item.id) ||
           this.filterSelection.isSelected(child.id);
  }
}
