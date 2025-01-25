import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-add-manager',
  templateUrl: './user-add-manager.component.html',
  styleUrls: ['./user-add-manager.component.css']
})
export class UserAddManagerComponent implements OnInit, AfterViewInit {

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

  constructor(
    private dialog: MatDialog,
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<UserAddManagerComponent>,
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      keyword: ''
    });
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password1: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: [''],
      is_active: false,
      is_staff: false,
      is_superuser: false,
    });
  }

  ngAfterViewInit(): void {

  }
  onSave() {
    const params = this.editForm.value;
    const pass = params['password']
    const pass1 = params['password1']
    if (pass == pass1) {
      Object.values(this.editForm.controls).forEach((c: FormControl) => c.markAsTouched());
      document.getElementById("pass_show").hidden = true;
      if (this.editForm.valid) {
        this.json.post('s/user_manager_api/set_user_data', params).subscribe((response: JsonResult) => {
          if (response.message != undefined) {
            this.cmp.pop(response.message);
            if (response.result) {
              this.dialogRef.close("1");
            }
          } else {
            this.cmp.pop("ユーザー名はもう存在しました");
            this.dialogRef.close("1");
          }
        });
      }
    } else {
      document.getElementById("pass_show").hidden = false;
      (<HTMLInputElement>document.getElementById("pass_show1")).innerHTML = "パスワードは不一致です"
    }
  }

  onCancel() {
    this.editForm.reset();
    this.dialogRef.close();
  }


}
