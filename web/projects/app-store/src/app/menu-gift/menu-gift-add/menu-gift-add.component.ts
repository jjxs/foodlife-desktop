import { Component, OnInit, ViewChild, Output, EventEmitter, } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormGroup, FormArray, FormBuilder, Validators  } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu-gift-add',
  templateUrl: './menu-gift-add.component.html',
  styleUrls: ['./menu-gift-add.component.css']
})
export class MenuGiftAddComponent implements OnInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  // 編集フォーム
  editForm: FormGroup;

  menuData=[]
  filteredOptions: Observable<any[]>;

  menu_list = [];

  constructor(
    private dialog: MatDialog,
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<MenuGiftAddComponent>,
  ) { }

  ngOnInit() {
    this.editForm = this.fb.group({
      menu: [{}, []],
      menu_id: ['', Validators.required],
      use_gift_count: ['', Validators.required],
      flg: false,
    });
    this.getMenuList()
    this.formChange()
  }

  displayFn(menu) {
    if (menu) {
      const arr = this.menuData.filter(item => item.id == menu)
      return arr[0].name
    }
  }

  _filter() {
    return this.menuData.filter(option => option.name.includes(this.editForm.controls.menu_id.value) || option.id.toString().includes(this.editForm.controls.menu_id.value));
  }

  formChange(){    
    this.filteredOptions = this.editForm.controls.menu_id.valueChanges.pipe(
      startWith(''),
      map(name => (name ? this._filter() : this.menuData.slice())),
    );
  }

  ngAfterViewInit(): void {

  }

  getMenuList(){
    this.json.post('s/menu_mgmt_api/get_menu_data/', {}).subscribe((response?: JsonResult) => {
      if (response) {
        this.menuData = response.data.menu;
        this.formChange()
      }
    });
  }
  onSave() {
    if (typeof this.editForm.controls.menu_id.value === 'string') {
      this.editForm.controls.menu_id.setValue('')
    }
    const params = this.editForm.value;
    //Object.values(this.editForm.controls).forEach((c: FormControl) => c.markAsTouched());
    if (this.editForm.valid) {
      this.json.post('restaurant/menu/save_menu_gift/', params).subscribe((response: JsonResult) => {
        if (response['message'] != undefined) {
          this.cmp.pop(response['message']);
          this.dialogRef.close("1");
        } else {
          this.cmp.pop("メニューもう存在しました");
          this.dialogRef.close("1");
        }
      });
    }

  }

  onCancel() {
    this.editForm.reset();
    this.dialogRef.close();
  }

}
