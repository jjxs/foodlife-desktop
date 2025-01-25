import { Component, OnInit, ViewChild, Output, Inject, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-edit-group',
  templateUrl: './user-edit-group.component.html',
  styleUrls: ['./user-edit-group.component.css']
})
export class UserEditGroupComponent implements OnInit, AfterViewInit {

  // 編集フォーム
  editForm: FormGroup;
  // ID
  users = null;
  user_detail = [];
  orign_users = [];
  groupid = [];

  menuList = {}

  constructor(
    private dialog: MatDialog,
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<UserEditGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
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
    // edit group data
    const group = data['event'];
    this.menuList = data['menuList'];
    if (Object.keys(group).length !== 0) {
      const params = this.editForm.value;
      params['id'] = group['id'];
      this.groupid = group['id'];
      this.json.post('s/user_group_api/set_group_edit_data', params).subscribe((response: JsonResult) => {
        if (response.data) {
          const formData = response.data[0];
          this.editForm.patchValue(this.parseData(formData));
          this.orign_users = formData['children'];
          if (formData['children'] == '') {
            this.loadMenuList(this.groupid);
            return;
          }
          this.user_detail = formData['children'];
          this.orign_users = [];
          this.loadMenuList(this.groupid);
        }
      });
    }
  }

  parseData(data) {
    if (data['menu_list']) {
      // tslint:disable-next-line: forin
      for (const path in data['menu_list']) {
        for (const key in this.menuList) {
          if (this.menuList[key] === data['menu_list'][path]) {
            data[key] = true;
            break;
          }
        }
      }
    }
    return data;
  }

  loadMenuList(groupid) {
    const params = this.editForm.value;
    params['group_id'] = groupid;
    this.json.post('s/user_group_api/get_edit_user_list', params).subscribe((response: JsonResult) => {
      if (response) {
        this.users = response['data'];
        this.orign_users = response['data'];
        this.changeMenuData();
      }
    });
  }
  addMenu(event, menu) {
    this.user_detail.push(menu);
    this.changeMenuData();
  }

  removeMenu(event, menu) {
    this.user_detail = this.user_detail.filter((detail) => {
      return detail.user_id !== menu.user_id;
    });
    this.changeMenuData();
    // const params = menu;
    // params['group_id'] = this.groupid;
    // this.json.post('s/user_group_api/del_group_data', params).subscribe((response: JsonResult) => {
    //   if (response) {
    //     this.changeMenuData();
    //   }
    // });
  }

  changeMenuData() {
    this.users = this.orign_users.filter((menu) => {
      const has = this.user_detail.findIndex((detail) => {
        return detail.user_id === menu.user_id;
      })
      if (has >= 0) {
        return false;
      }
      return true;
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }
  onCancel() {
    this.editForm.reset();
    this.dialogRef.close();
  }

  onSave() {

    const menu_binds = [];
    // tslint:disable-next-line: forin
    for (const i in this.user_detail) {
      menu_binds.push(this.user_detail[i]['user_id']);
    }
    const params = this.editForm.value;
    params['user_ids'] = menu_binds;
    params['id'] = this.groupid;
    params['menu_list'] = {};
    for ( const key in this.menuList ) {
      if (params[key]) {
        params['menu_list'][key] = this.menuList[key];
      }
    }
    if (this.editForm.valid) {
      this.json.post('s/user_group_api/set_edit_group_data', params).subscribe((response: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          if (response.result) {
            this.dialogRef.close('1');
          }
        }
      });
    }
  }
}
