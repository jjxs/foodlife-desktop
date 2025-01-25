import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Util, JsonService, JsonResult, CmpService } from 'app-lib';

@Component({
  selector: 'app-ingredients-edit',
  templateUrl: './ingredients-edit.component.html',
  styleUrls: ['./ingredients-edit.component.css']
})
export class IngredientsEditComponent implements OnInit {

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
    public dialogRef: MatDialogRef<IngredientsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      ing_no: ['', Validators.required],
      ing_name: ['', Validators.required],
      ing_cat_id: [this.categories, Validators.required],
      consumption_unit: ['', []],
      stock_unit: ['', Validators.required],
      unit_conv_rate: [0, []],
      ave_price: ['', Validators.required]
    });
    if (Object.keys(data).length !== 0) {
      if (data['result'] && Object.keys(data['result']).length !== 0) {
        this.currentID = data['result']['id'];
        this.editForm.patchValue(data['result']);
        this.newflag = 1;
      }
      this.categories = data['categories'];
    }
  }

  ngOnInit() {
  }

  onSave() {
    const params = this.editForm.value;
    params['ing_id'] = this.currentID;
    Object.values(this.editForm.controls).forEach((c: FormControl) => c.markAsTouched());
    if (params['ave_price'] != null) {
      if (params['ave_price'].toString() == "") {
        document.getElementById("ave_price_a").hidden = false;
        (<HTMLInputElement>document.getElementById("ave_price_b")).innerHTML = "必須項目です"
      } else if (params['ave_price'].toString() == "0") {
        document.getElementById("ave_price_a").hidden = false;
        (<HTMLInputElement>document.getElementById("ave_price_b")).innerHTML = "0は不可です"
      } else {
        document.getElementById("ave_price_a").hidden = true;
        if (this.editForm.valid) {
          this.json.post('s/ingredients_api/set_ing_data', params).subscribe((response: JsonResult) => {
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
    } else {
      document.getElementById("ave_price_a").hidden = false;
      (<HTMLInputElement>document.getElementById("ave_price_b")).innerHTML = "必須項目です"
    }
  }

  onCancel() {
    this.editForm.reset();
    this.currentID = null;
    // this.edit.emit(false);
    this.dialogRef.close();
  }

  // 在庫単位設定後消費単位とレートを自動設定
  setRate() {
    const stock = this.editForm.get('stock_unit').value;
    const consumption = this.editForm.get('consumption_unit').value;
    const rate = this.editForm.get('unit_conv_rate').value;

    if (stock && !consumption && !rate) {
      this.editForm.get('consumption_unit').setValue(stock);
      this.editForm.get('unit_conv_rate').setValue(1);
    }
  }

  getStockUnit() {
    const unit = this.editForm.get('stock_unit').value || '';
    return '/' + unit;
  }

  getUnitPrice() {
    const rate = this.editForm.get('unit_conv_rate').value;
    const unit = this.editForm.get('consumption_unit').value;
    const stockPrice = this.editForm.get('ave_price').value;
    if (rate && rate > 0 && unit) {
      const price = Math.round(stockPrice * 100 / rate) / 100;
      return String(price) + '円/' + unit;
    }
    // newflag1=0　初めて場合　　　newflag1=1　初めてじゃない場合
    if (this.newflag1 != 1) {
      (<HTMLInputElement>document.getElementById("content")).value = '0';
      this.newflag1 = 1
    }
    return '';
  }

}
