import { Component, OnInit, ViewChild, Output, Inject, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-edit-manager',
  templateUrl: './user-edit-manager.component.html',
  styleUrls: ['./user-edit-manager.component.css']
})
export class UserEditManagerComponent implements OnInit, AfterViewInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  searchForm: FormGroup;

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  // テーブル
  displayedColumns = ['cat_name', 'explanation', 'button'];
  dataSource = new MatTableDataSource<any>([]);
  // カテゴリーフラグ
  catFlg = false;
  // カテゴリー編集データ
  catData = {};
  // 編集フォーム
  editForm: FormGroup;
  // カテゴリー
  categories = [];
  // 通貨
  currencys = [];
  // ID
  currentID = null;
  flag = true;
  newflag = 0;
  newflag1 = 0;

  constructor(
    private dialog: MatDialog,
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<UserEditManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', []],
      password1: ['', []],
      first_name: ['',  Validators.required],
      last_name: [''],
      is_active: false,
      is_staff: false,
      is_superuser: false,
    });
    if (Object.keys(data).length !== 0) {
      const params = this.editForm.value;
      params['id'] = data['id'];
      this.json.post('s/user_manager_api/get_user_edit_data', params).subscribe((response: JsonResult) => {
        if (response.data) {
          this.editForm.patchValue(response.data[0]);
          this.currentID = params['id'];
          (<HTMLInputElement>document.getElementById("pass")).value = "";
          (<HTMLInputElement>document.getElementById("pass1")).value = "";
        }
      });
    }

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
    const params = this.editForm.value;
    params['id'] = this.currentID;
    const pass = (<HTMLInputElement>document.getElementById("pass")).value
    const pass1 = (<HTMLInputElement>document.getElementById("pass1")).value
    if (pass == pass1) {
      Object.values(this.editForm.controls).forEach((c: FormControl) => c.markAsTouched());
      document.getElementById("pass_show").hidden = true;
      if (this.editForm.valid) {
        this.json.post('s/user_manager_api/set_edit_user_data', params).subscribe((response: JsonResult) => {
          if (response) {
            this.cmp.pop(response.message);
            if (response.result) {
              this.dialogRef.close("1");
            }
          }
        });
      }
    } else {
      document.getElementById("pass_show").hidden = false;
      (<HTMLInputElement>document.getElementById("pass_show1")).innerHTML = "パスワードは不一致です"
    }
  }
}
