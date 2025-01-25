import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Util, JsonService, JsonResult, CmpService } from 'app-lib';
import {FormControl} from '@angular/forms';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-shop-cost-edit',
  templateUrl: './shop-cost-edit.component.html',
  styleUrls: ['./shop-cost-edit.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ShopCostEditComponent implements OnInit {

  @Output() edit = new EventEmitter<any>();
  @Output() saved = new EventEmitter<any>();

  // @Input('data') set data(init: object) {
  //   if (Object.keys(init).length !== 0) {
  //     if (init['result'] && Object.keys(init['result']).length !== 0) {
  //       this.currentID = init['result']['id'];
  //       this.editForm.patchValue(init['result']);
  //     }
  //     this.categories = init['categories'];
  //   }
  // }

  // 編集フォーム
  editForm: FormGroup;
  // カテゴリー
  categories = [];
  // 通貨
  currencys = [];
  // 材料ID
  currentID = null;

  pay_time = new FormControl();

  constructor(
    private fb: FormBuilder,
    private cmp: CmpService,
    private json: JsonService,
    public dialogRef: MatDialogRef<ShopCostEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.editForm = this.fb.group({
      cost_name: ['', [Validators.required]],
      cost_category_id: [this.categories,Validators.required],
      cost: ['', [Validators.required]],
      pay_time: [this.pay_time,Validators.required]
    });
    if (Object.keys(data).length !== 0) {
        if (data['result'] && Object.keys(data['result']).length !== 0) {
          this.currentID = data['result']['id'];
          this.editForm.patchValue(data['result']);
        }
        this.categories = data['categories'];
    }
  }

  ngOnInit() {
  }

  onSave() {
    Object.values(this.editForm.controls).forEach((c: FormControl) => c.markAsTouched());
    const params = this.editForm.value;
    const date = new Date(params["pay_time"]);
    params['pay_time'] = date.toLocaleDateString();
    params['cost_id'] = this.currentID;
    if ( this.editForm.valid ) {
      this.json.post('s/shop_cost_api/set_ing_data', params).subscribe((response: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          if (response.result) {
            this.currentID = response.data;
            //this.edit.emit(true);
            this.dialogRef.close(true);
          }
        }
      });
    }
  }

  onCancel() {
    this.editForm.reset();
    this.currentID = null;
    //this.edit.emit(false);
    this.dialogRef.close(false);
  }

}
