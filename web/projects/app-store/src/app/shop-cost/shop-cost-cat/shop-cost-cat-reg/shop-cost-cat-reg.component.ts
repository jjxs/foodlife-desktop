import { Component, OnInit, Output, Inject, EventEmitter, Input } from '@angular/core';
import { CmpWindowService, JsonService, JsonResult, CmpService } from 'app-lib';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-shop-cost-cat-reg',
  templateUrl: './shop-cost-cat-reg.component.html',
  styleUrls: ['./shop-cost-cat-reg.component.css']
})
export class ShopCostCatRegComponent implements OnInit {

  @Output() edit = new EventEmitter<any>();
  @Output() saved = new EventEmitter<any>();

  // @Input('data') set data(init: object) {
  //   if (Object.keys(init).length !== 0) {
  //     this.hasParent = true;
  //     if (init['result'] && Object.keys(init['result']).length !== 0) {
  //       this.currentID = init['result']['id'];
  //       this.dataForm.patchValue(init['result']);
  //     }
  //     if (init['result'] && !init['result']['parent_id']) {
  //       this.hasParent = false;
  //     }
  //     this.parents = init['parents'];
  //   }
  // }

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
    public dialogRef: MatDialogRef<ShopCostCatRegComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataForm = this.fb.group({
      cat_no: '',
      category_name: ['', [Validators.maxLength(32), Validators.required]],
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
    params['category_id'] = this.currentID;
    if (this.dataForm.valid) {
      this.json.post('s/shop_cost_api/set_cat_data', params).subscribe((response: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          if (response.result) {
            this.currentID = response.data;
            this.dialogRef.close(true);
          }
        }
      });
    }
  }

  onCancel() {
    this.dataForm.reset();
    this.currentID = null;
    //this.edit.emit(false);
    this.dialogRef.close(false);
  }

}
