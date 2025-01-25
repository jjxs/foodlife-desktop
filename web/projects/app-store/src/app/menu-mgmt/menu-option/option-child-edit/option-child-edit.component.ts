import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Util, JsonService, JsonResult, CmpService } from 'app-lib';

@Component({
  selector: 'app-option-child-edit',
  templateUrl: './option-child-edit.component.html',
  styleUrls: ['./option-child-edit.component.css']
})
export class OptionEditChildComponent implements OnInit {

  @Output() edit = new EventEmitter<any>();
  @Output() saved = new EventEmitter<any>();

  // 編集フォーム
  editForm: FormGroup;
  // カテゴリー
  categories = [];
  // 通貨
  currencys = [];
  // 材料ID
  currentID = null;

  flag = true;
  newflag = 0;
  newflag1 = 0;
  // 　inputのclick事件
  clear() {
    if (this.flag) {
      //  修正じゃない場合
      if (this.newflag != 1) {
        (<HTMLInputElement>document.getElementById("content")).value = '';
        this.flag = false;
      }
    }
  }

  constructor(
    private fb: FormBuilder,
    private cmp: CmpService,
    private json: JsonService,
    public dialogRef: MatDialogRef<OptionEditChildComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
    //   code: ['', Validators.required],
      display_name: ['', Validators.required],
    //   theme_id: ['', Validators.required],
    //   menu_count: ['', Validators.required],
      display_order: ['', Validators.required],
    });
    let params = {};
    params['parent_id'] = data;
    this.json.post('s/menu_mgmt_api/select_option_child_data', params).subscribe((response: JsonResult) => {
      if (response.message == "Success") {
        if (response.result) {
          this.currentID = data
          this.editForm.patchValue(response.data[0]);
          // this.dialogRef.close("1");
        }
      }
    });
  }

  ngOnInit() {
  }

  onSave() {
    const params = this.editForm.value;
    params['id'] = this.currentID;
    params['flag'] = "child";
    if (this.editForm.valid) {
      this.json.post('s/menu_mgmt_api/update_data', params).subscribe((response: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          if (response.result) {
            this.dialogRef.close(true);
          }
        }
      });
    }
  }

  onCancel() {
    this.editForm.reset();
    this.currentID = null;
    // this.edit.emit(false);
    this.dialogRef.close(false);
  }
}
