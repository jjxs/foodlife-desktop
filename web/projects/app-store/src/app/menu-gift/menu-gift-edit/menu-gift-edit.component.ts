import { Component, OnInit, ViewChild, Output, Inject, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu-gift-edit',
  templateUrl: './menu-gift-edit.component.html',
  styleUrls: ['./menu-gift-edit.component.css']
})
export class MenuGiftEditComponent implements OnInit, AfterViewInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  searchForm: FormGroup;

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  // 編集フォーム
  editForm: FormGroup;
  // ID
  currentID = null;

  menu_list = [];

  menuData=[]
  filteredOptions: Observable<any[]>;

  constructor(
    private dialog: MatDialog,
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<MenuGiftEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      menu: [{}, []],
      menu_id: ['', Validators.required],
      use_gift_count: ['', Validators.required],
      flg: false,
    });
    //this.getMenuList()
    this.getMenuList(data);
    this.formChange();
    


  }

  ngOnInit() {
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

  getMenuList(data){
    this.json.post('s/menu_mgmt_api/get_menu_data/', {}).subscribe((response?: JsonResult) => {
      if (response) {
        this.menuData = response.data.menu;
        this.formChange();

        if (Object.keys(data).length !== 0) {   
          const params = this.editForm.value;
          params['id'] = data['id'];
          this.json.post('restaurant/menu/get_menu_gift_edit_data/', params).subscribe((response: any) => {
            debugger;
            if (response) {
              this.editForm.patchValue(response[0]);
              
              this.currentID = params['id'];
                        // this.editForm.get("level").setValue(response.data[0].level);
              // this.editForm.get("sex").setValue(response.data[0].sex);
            }
          });
        }
      }
    });
  }

  onCancel() {
    this.editForm.reset();
    this.dialogRef.close();
  }

  onSave() {
    if (typeof this.editForm.controls.menu_id.value === 'string') {
      this.editForm.controls.menu_id.setValue('')
    }
    const params = this.editForm.value;
    params['id'] = this.currentID;

    //Object.values(this.editForm.controls).forEach((c: FormControl) => c.markAsTouched());
    if (this.editForm.valid) {
      this.json.post('restaurant/menu/set_edit_menu_gift_data/', params).subscribe((response: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          this.dialogRef.close("1");
         
        }
      });
    }

  }
}
