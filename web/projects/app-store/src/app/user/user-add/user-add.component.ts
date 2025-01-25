import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit, AfterViewInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  // 編集フォーム
  editForm: FormGroup;

  level_list = [
    {'id': 1, 'name': 'VIP1'},
    {'id': 2, 'name': 'VIP2'},
    {'id': 3, 'name': 'VIP3'}
  ];

  constructor(
    private dialog: MatDialog,
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<UserAddComponent>,
  ) { }

  ngOnInit() {
    this.editForm = this.fb.group({
      account: ['', Validators.required],
      password: ['', []],
      password1: ['', []],
      level: ['',  Validators.required],
      user_name: ['', []],
      sex: ['', []],
      phone_number: ['', []],
      remarks: ['', []],
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
        this.json.post('s/user_api/set_user_data', params).subscribe((response: JsonResult) => {
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
