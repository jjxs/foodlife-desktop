import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { TableEmptyMessageComponent, JsonService, CmpService, JsonResult, Util, AppSettings } from 'app-lib';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { AddCatComponent } from './add-cat/add-cat.component';
import { MatDialog } from '@angular/material';
import { MenuEditComponent } from './menu-edit/menu-edit.component';
import { MenuEditChildComponent } from './menu-child-edit/menu-child-edit.component';

@Component({
  selector: 'app-menu-cat',
  templateUrl: './menu-cat.component.html',
  styleUrls: ['./menu-cat.component.css']
})
export class MenuCatComponent implements OnInit, AfterViewInit {

  @ViewChild('catempty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  tableForm: FormGroup;

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  // テーブル
  displayedColumns = ['cat_name', 'explanation', 'button'];
  dataSource = new MatTableDataSource<any>([]);
  expandFlg = false;

  // editingRow = null;
  editMode = false;

  theme_list = AppSettings.getThemeList();

  showkitchen = false;

  // data = [];

  get parentCat() {
    return this.tableForm.get('parentCat') as FormArray;
  }
  constructor(
    private dialog: MatDialog,
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService
  ) { }

  ngOnInit() {
    this.tableForm = this.fb.group({
      parentCat: this.fb.array([])
    });
  }

  ngAfterViewInit(): void {
    this.onSearch();
  }

  showThemeList() {

  }
  showThemeName(theme_id) {
    for ( const i in this.theme_list ) {
      if (this.theme_list[i]['id']==theme_id) {
        return this.theme_list[i]['name'];
      }
    }
    return theme_id;
  }

  kitchen(event) {
    this.showkitchen = event.checked;
    this.onSearch();
  }

  onSearch() {
    this.empty.refreshFlg = false;
    this.dataSource.data = [];
    this.selection.clear();
    this.json.post('s/menu_mgmt_api/get_cat_data', {'kitchen': this.showkitchen}).subscribe((response: JsonResult) => {
      if (response) {
        this.empty.refreshFlg = true;
        this.setParentCat(response.data);
        this.dataSource.data = response.data;

        setTimeout(function () {
          var button_num = document.getElementsByClassName("mat-icon notranslate material-icons mat-icon-no-color ng-star-inserted")
          for (var i = 0; i < button_num.length; i++) {
            let element: HTMLElement = button_num[i] as HTMLElement;
            element.click();
          }
        })
      }
    });
  }

  setParentCat(data) {
    this.parentCat.clear();
    data.forEach(item => {
      const parent = this.fb.group({
        // ID
        id: '',
        // カテゴリー名
        display_name: '',
        // 表示順
        display_order: null,
        // 子要素
        children: this.fb.array([]),
        // 展開
        display: '',
      });

      const childArray = parent.get('children') as FormArray;
      item['children'].forEach(() => {
        childArray.push(this.fb.group({
          // ID
          id: null,
          // 親ID
          group_id: '',
          // カテゴリー名
          display_name: '',
          // 表示順
          display_order: null
        }));
      });
      this.parentCat.push(parent);
    });
    this.parentCat.patchValue(data);
  }

  onEdit(event, flag) {
    if (flag == "parent") {
      const dialog = this.dialog.open(MenuEditComponent, {
        width: '700px',
        height: '345px',
        data: event.id
      })
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.onSearch()
        }
      });
    } else {
      const dialog = this.dialog.open(MenuEditChildComponent, {
        width: '700px',
        height: '420px',
        data: { id:event.id, theme_list:this.theme_list }
      })
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.onSearch()
        }
      });
    }

  }

  onCancelEdit() {
    this.selection.clear();
    this.setParentCat(this.dataSource.data);
    this.editMode = false;
  }

  onAddCat() {
    const dialog = this.dialog.open(AddCatComponent, {
      width: '400px',
      height: '350px',
      data: this.parentCat.value
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.onSearch()
      }
    });
  }


  onSave() {
    const parents = [];
    const children = [];
    this.parentCat.controls.forEach(parent => {
      if (parent.dirty) {
        parents.push(parent.value);
        const childrenArray = parent.get('children') as FormArray;
        if (childrenArray.dirty) {
          childrenArray.controls.forEach(child => {
            if (child.dirty) {
              children.push(child.value);
            }
          });
        }
      }
    });
    if (!Util.isEmptyArray(parents)) {
      const params = {
        parents,
        children
      };
      this.json.post('s/menu_mgmt_api/update_cat_data', params).subscribe((response: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          // this.onSearch();
        }
      });
    }
  }

  onMove(item) {
    const params = {
      rows: this.selection.selected,
      group_id: item
    };

    this.json.post('s/menu_mgmt_api/move_cat_group', params).subscribe((response: JsonResult) => {
      if (response.message) {
        this.cmp.pop(response.message);
        this.onSearch();
      }
    });
  }

  onDelete(row) {
    this.cmp.confirm('カテゴリーを削除しますか？').afterClosed().subscribe(result => {
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

    this.json.post('s/menu_mgmt_api/delete_cat_data', params).subscribe((response: JsonResult) => {
      if (response.result) {
        this.cmp.pop(response.message);
        this.onSearch();
      }
    });
  }

  // すべて展開
  onAllToggleExpand() {
    this.dataSource.data.forEach(item => {
      item['display'] = 'table-row';
    });
    this.parentCat.controls.forEach(form => {
      form.get('display').setValue('table-row');
    });
    this.expandFlg = true;
  }

  // すべて折り畳む
  onAllToggleCollapse() {
    this.dataSource.data.forEach(item => {
      item['display'] = 'none';
    });
    this.parentCat.controls.forEach(form => {
      form.get('display').setValue('none');
    });
    this.expandFlg = false;
  }

  // 展開・折り畳む
  onToggle(group, index) {
    if (group['display'] === 'none') {
      group['display'] = 'table-row';
    } else {
      group['display'] = 'none';
    }
    this.parentCat.controls[index].get('display').setValue(group['display']);
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

  parentToggle(parent, index) {
    if (this.selection.isSelected(parent)) {
      this.selection.deselect(parent);
      parent.children.forEach(child => this.selection.deselect(child));
    } else {
      this.selection.select(parent);
      parent.children.forEach(child => this.selection.select(child));
      if (parent['display'] === 'none') {
        parent['display'] = 'table-row';
      }
      this.parentCat.controls[index].get('display').setValue(parent['display']);
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear()
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        row.children.forEach((child: any) => this.selection.select(child));
      });
      this.onAllToggleExpand();
    }
  }
}
