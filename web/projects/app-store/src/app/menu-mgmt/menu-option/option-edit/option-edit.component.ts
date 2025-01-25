import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Util, JsonService, JsonResult, CmpService } from 'app-lib';

@Component({
  selector: 'app-option-edit',
  templateUrl: './option-edit.component.html',
  styleUrls: ['./option-edit.component.css']
})
export class OptionEditComponent implements OnInit {

  // データフォーム
  dataForm: FormGroup;

  // データID
  currentID = null;

  constructor(
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<OptionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataForm = this.fb.group({
      display_name: ['', Validators.required],
      display_order: ['', [Validators.required]],
    });
    let params = {};
    params['parent_id'] = data;
    this.json.post('s/menu_mgmt_api/select_option_data', params).subscribe((response: JsonResult) => {
      if (response.message == "Success") {
        if (response.result) {
          this.currentID = data
          this.dataForm.patchValue(response.data[0]);
          // this.dialogRef.close("1");
        }
      }
    });
    // if (Object.keys(data).length !== 0) {
    //   if (data['result'] && Object.keys(data['result']).length !== 0) {
    //     this.currentID = data['result']['id'];
    //     this.dataForm.patchValue(data['result']);
    //   }
    // }

  }

  ngOnInit() {

  }

  onSave() {
    const params = this.dataForm.value;
    params['id'] = this.currentID;
    params['flag'] = "parent";
    if (this.dataForm.valid) {
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
    this.dataForm.reset();
    this.currentID = null;
    // this.edit.emit(false);
    this.dialogRef.close(false);
  }

}