import { Component, OnInit, Output, Inject, EventEmitter, Input } from '@angular/core';
import { CmpWindowService, JsonService, JsonResult, CmpService } from 'app-lib';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cat-reg',
  templateUrl: './cat-reg.component.html',
  styleUrls: ['./cat-reg.component.css']
})
export class CatRegComponent implements OnInit {

  @Output() edit = new EventEmitter<any>();
  @Output() saved = new EventEmitter<any>();

  // データフォーム
  dataForm: FormGroup;

  // データID
  currentID = null;

  // 親リスト
  parents = [];

  // 親選択可能
  hasParent = true;

  constructor(
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<CatRegComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataForm = this.fb.group({
      cat_name: ['', [Validators.required, Validators.maxLength(32)]],
      explanation: ['', [Validators.maxLength(64)]],
      parent_id: ''
    });
    if (Object.keys(data).length !== 0) {
      this.hasParent = true;
      if (data['result'] && Object.keys(data['result']).length !== 0) {
        this.currentID = data['result']['id'];
        this.dataForm.patchValue(data['result']);
      }
      if (data['result'] && !data['result']['parent_id']) {
        this.hasParent = false;
      }
      this.parents = data['parents'];
    }
  }

  ngOnInit() {

  }

  onSave() {
    const params = this.dataForm.value;
    params['cat_id'] = this.currentID;
    Object.values(this.dataForm.controls).forEach((c: FormControl) => c.markAsTouched());
    if (this.dataForm.valid) {
      this.json.post('s/ingredients_api/set_cat_data', params).subscribe((response: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          if (response.result) {
            this.currentID = response.data;
            this.dialogRef.close("1");
          }
        }
      });
    }

  }

  onCancel() {
    this.dataForm.reset();
    this.currentID = null;
    // this.edit.emit(false);
    this.dialogRef.close();
  }

}
