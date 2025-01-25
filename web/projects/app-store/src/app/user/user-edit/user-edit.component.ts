import { Component, OnInit, ViewChild, Output, Inject, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, AfterViewInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;
  @Output() edit = new EventEmitter<any>();

  searchForm: FormGroup;

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  // 編集フォーム
  editForm: FormGroup;
  // ID
  currentID = null;

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
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      account: ['', Validators.required],
      password: ['', []],
      password1: ['', []],
      level: ['',  Validators.required],
      point: ['',  Validators.required],
      gift_count: ['',  Validators.required],
      user_name: ['', []],
      sex: ['', []],
      phone_number: ['', []],
      remarks: ['', []],
    });
    if (Object.keys(data).length !== 0) {   
      const params = this.editForm.value;
      params['id'] = data['id'];
      this.json.post('s/user_api/get_user_edit_data', params).subscribe((response: JsonResult) => {
        if (response.data) {
          this.editForm.patchValue(response.data[0]);
          
          this.currentID = params['id'];
          debugger;
          this.editForm.get("level").setValue(response.data[0].level);
          this.editForm.get("sex").setValue(response.data[0].sex);
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
        this.json.post('s/user_api/set_edit_user_data', params).subscribe((response: JsonResult) => {
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
