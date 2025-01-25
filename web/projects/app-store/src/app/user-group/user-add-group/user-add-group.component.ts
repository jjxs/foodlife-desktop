import { Component, OnInit, ViewChild, Output, Inject, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialogRef, MatTableDataSource , MAT_DIALOG_DATA} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-add-group',
  templateUrl: './user-add-group.component.html',
  styleUrls: ['./user-add-group.component.css']
})
export class UserAddGroupComponent implements OnInit, AfterViewInit {

  // 編集フォーム
  editForm: FormGroup;
  orign_users = [];
  users = null;
  user_group_detail = [];

  menuList = {};

  constructor(
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<UserAddGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.menuList = data['menuList'];
    this.loadMenuList();
    this.orign_users = [];
  }

  ngOnInit() {
    this.editForm = this.fb.group({
      group_name: ['', Validators.required],
      counter: [false],
      menu: [false],
      seats: [false],
      order: [false],
      kitchen: [false],
      settings: [false],
      manager: [false],
      menumgmt: [false],
      ingredients: [false],
      inventorycontrol: [false],
      shopcost: [false],
      charts: [false],
      usermanager: [false],
      usergroup: [false],
      payment: [false],
      setsubimanager: [false],
      staff: [false],
    });
  }

  ngAfterViewInit(): void {

  }

  loadMenuList() {
    this.json.post('s/user_group_api/get_user_list', {}).subscribe((response: JsonResult) => {
      if (response) {
        this.users = response['data'];
        this.orign_users = response['data'];
      }
    })
  }

  changeMenuData() {
    this.users = this.orign_users.filter((menu) => {
      const has = this.user_group_detail.findIndex((detail) => {
        return detail.id === menu.id;
      });
      if (has >= 0) {
        return false;
      }
      return true;
    });
  }

  addMenu(event, menu) {
    this.user_group_detail.push(menu);
    this.changeMenuData();
  }

  removeMenu(event, menu) {
    this.user_group_detail = this.user_group_detail.filter((detail) => {
      return detail.id !== menu.id;
    });
    this.changeMenuData();
  }

  onSave() {

    const menu_binds = [];
    // tslint:disable-next-line: forin
    for (const i in this.user_group_detail) {
      menu_binds.push(this.user_group_detail[i]['id']);
    }
    const params = this.editForm.value;
    params['user_ids'] = menu_binds;

    params['menu_list'] = {};
    for ( const key in this.menuList ) {
      if (params[key]) {
        params['menu_list'][key] = this.menuList[key];
      }
    }

    if (this.editForm.valid) {
      this.json.post('s/user_group_api/set_group_data', params).subscribe((response: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          if (response.result) {
            this.dialogRef.close('1');
          }
        }
      });
    }
  }

  onCancel() {
    this.editForm.reset();
    this.dialogRef.close();
  }
}
