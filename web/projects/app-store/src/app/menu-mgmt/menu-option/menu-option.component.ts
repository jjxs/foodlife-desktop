import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { TableEmptyMessageComponent, JsonService, CmpService, JsonResult, Util } from 'app-lib';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { AddOptionComponent } from './add-option/add-option.component';
import { MatDialog } from '@angular/material';
import { OptionEditComponent } from './option-edit/option-edit.component';
import { OptionEditChildComponent } from './option-child-edit/option-child-edit.component';

@Component({
  selector: 'app-menu-option',
  templateUrl: './menu-option.component.html',
  styleUrls: ['./menu-option.component.css']
})
export class MenuOptionComponent implements OnInit, AfterViewInit {

  @ViewChild('catempty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  tableForm: FormGroup;

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  // テーブル
  displayedColumns = ['cat_name', 'explanation', 'button'];
  dataSource = new MatTableDataSource<any>([]);
  expandFlg = true;

  // editingRow = null;
  editMode = false;

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

  onSearch() {
    this.empty.refreshFlg = false;
    this.dataSource.data = [];
    this.selection.clear();
    this.json.post('s/menu_mgmt_api/get_option_data', {}).subscribe((response: JsonResult) => {
      if (response) {
        this.empty.refreshFlg = true;
        this.setParentCat(response.data);
        this.dataSource.data = response.data;

        this.dataSource.data.forEach(item => {
          item['display'] = 'table-row';
        });
        this.parentCat.controls.forEach(form => {
          form.get('display').setValue('table-row');
        });
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
    //this.edit.emit(event.id);
    if (flag == "parent") {
      const dialog = this.dialog.open(OptionEditComponent, {
        width: '700px',
        height: '295px',
        data: event.id
      })
      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.onSearch()
        }
      });
    } else {
      const dialog = this.dialog.open(OptionEditChildComponent, {
        width: '700px',
        height: '295px',
        data: event.id
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

  onAddOption() {
    // this.cmp.open(AddOptionComponent, { parents: this.dataSource.data }).afterClosed()
    //   .subscribe((result) => {
    //     if (result === 'added') {
    //       this.onSearch();
    //     }
    //   });
    const dialog = this.dialog.open(AddOptionComponent, {
      width: '400px',
      height: '350px',
      data: { parents: this.dataSource.data }
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.onSearch()
      }
    });
  }


  // onToggleParentEdit(index) {
  //   if (index === this.editingRow) {
  //     this.editingRow = null;
  //   } else {
  //     this.editingRow = index;
  //   }
  // }

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
      this.json.post('s/menu_mgmt_api/update_option_data', params).subscribe((response: JsonResult) => {
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

    this.json.post('s/menu_mgmt_api/move_option_group', params).subscribe((response: JsonResult) => {
      if (response.message) {
        this.cmp.pop(response.message);
        this.onSearch();
      }
    });
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

    this.json.post('s/menu_mgmt_api/delete_option_data', params).subscribe((response: JsonResult) => {
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
