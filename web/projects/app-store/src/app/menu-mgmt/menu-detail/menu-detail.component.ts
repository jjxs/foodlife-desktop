import { Component, OnInit, Output, EventEmitter, Input, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { JsonService, CmpService, JsonResult, Util } from 'app-lib';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatSelectChange } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.css']
})
export class MenuDetailComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput;


  @Output() edit = new EventEmitter<any>();
  @Output() saved = new EventEmitter<any>();
  grouptype = [{ 'id': 30, 'value': '是' }, { 'id': 31, 'value': '否' }];
  // 明細フォーム
  detailForm: FormGroup;
  // カレントメニューID
  currentID = null;
  // 材料リスト
  ingList = [];
  // メニューカテゴリー
  menu_categories = [];
  // メニュー options
  menu_options = [];
  // メニュー写真
  menuImage = null;
  // メニュー写真サイズ
  menuImageSize = 0;
  // メニュー写真名
  menuImageName = '';

  image = '';

  recipeLen = 0;

  recipes = [];

  map_menu_option = {};
  menu_option_price = [];

  // レシピリスト
  get recipe() {
    return this.detailForm.get('recipe') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private cmp: CmpService,
    private json: JsonService,
    public dialogRef: MatDialogRef<MenuDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object
  ) {
    this.detailForm = this.fb.group({
      // メニュー番号
      // no: ['', [Validators.required]],
      // メニュー名
      name: ['', [Validators.required, Validators.maxLength(200)]],
      // 価格
      price: ['', [Validators.required]],
      // 税込み
      tax_in: false,
      // 使用中
      usable: true,
      // 備考
      note: ['', [Validators.maxLength(200)]],
      // 説明
      introduction: '',
      // メニュー番号
      recipe: this.fb.array([]),
      // カテゴリー
      menu_category: [[], []],
      // カテゴリーID
      menu_category_id: [[], []],
      // オプション
      menu_option: [[], []],
      // オプションID
      menu_option_id: [[], []],
      // キャンペーン価格
      sale_price: null,
      // キャンペーン価格
      sale: false,
      //
      ori_price: 0,
      // takeout
      takeout: 0,
      stock_status_id: [[], []],
      mincount: 1,

    });
    if (Object.keys(data).length !== 0) {
      this.ingList = data['ing'];
      this.menu_categories = data['cat'];
      this.menu_options = data['options'];
      if (data['result'] && Object.keys(data['result']).length !== 0) {
        this.currentID = data['result']['menu_id'];
        // if (init['result']['img_data']) {
        //   this.menuImage = 'data:image/jpeg;base64,' + init['result']['img_data'];
        // }

        this.image = '';
        this.menuImage = '';
        if (!Util.isEmpty(data['result']['image'])) {
          this.image = data['site_image_host'] + '/' + data['result']['image'] + '?t=' + Math.random();
        }

        // if (data['result']['recipe'].length > 3) {
        this.recipeLen = data['result']['recipe'].length;
        Array.from(Array(this.recipeLen)).forEach(() => {
          this.onAddRecipe();
        });
        // }
        this.detailForm.patchValue(data['result']);
        if( !Util.isEmpty(this.detailForm.value['menu_option']) ) {
          this.onChange(this.detailForm.value['menu_option'], data['result']['menu_option_price']);
        }
        // this.recipe.patchValue(data['result']['recipe']);
        // this.recipe.controls.forEach((form: FormGroup) => {
        //   this.getRecipePrice(form);
        // });
        // if (this.recipeLen < 3) {
        //   Array.from(Array(3 - this.recipeLen)).forEach(() => {
        //     this.onAddRecipe();
        //   });
        // }

        // this.recipes = this.recipe.value;
      }
    }
  }

  ngOnInit() {
    // 初期化でレシピに三行空白を入れる
    // Array.from(Array(3)).forEach(() => {
    //   this.onAddRecipe();
    // });
  }

  // 材料選択
  onSelectIng(event, form: FormGroup) {
    const ing = this.ingList.find(item => item['ing_id'] === event.value);
    if (ing) {
      form.patchValue(ing);
      this.getRecipePrice(form);
    } else {
      form.reset();
      form.get('serving').setValue(0);
      form.get('amount_to_use').setValue(0);
    }
  }

  // 材料単位取得
  getUnit(form: FormGroup) {
    return form.get('consumption_unit').value;
  }

  // 材料単価取得
  getIngPrice(form: FormGroup) {
    const rate = form.get('unit_conv_rate').value;
    const unit = form.get('consumption_unit').value;
    const stockPrice = form.get('ave_price').value;
    if (rate && rate > 0) {
      const price = Math.round(stockPrice * 100 / rate) / 100;
      if (price > 0 && unit) {
        return String(price) + '円/' + unit;
      }
    }
    return '';
  }

  // レシピ単価取得
  getRecipePrice(form: FormGroup) {
    const rate = form.get('unit_conv_rate').value;
    const stockPrice = form.get('ave_price').value;
    const used = form.get('amount_to_use').value;
    if (rate && rate > 0 && used && used > 0) {
      const ingPrice = Math.round(stockPrice * used * 100 / rate) / 100;
      form.get('recipe_cost').setValue(String(ingPrice) + '円');
    } else {
      form.get('recipe_cost').setValue('');
    }
  }

  // レシピコスト合計取得
  getTotalCost() {
    const all = this.recipe.value;
    let total = 0
    all.forEach(element => {
      if (element['recipe_cost']) {
        total += parseInt(element['recipe_cost'])
      }
    });
    return Math.round(total);
  }

  // 前の画面に戻る
  onCancel() {
    this.detailForm.reset();
    this.currentID = null;
    // this.edit.emit(false);
    this.dialogRef.close(false);
    // this.ngOnInit();
  }

  // レシピ削除
  onDeleteRecipe(index) {
    this.recipe.removeAt(index);
  }

  // 保存
  onSave() {
    if (this.detailForm.valid) {
      const params = this.detailForm.value;
      params['imgData'] = this.menuImage;
      params['size'] = this.menuImageSize;
      params['imgName'] = this.menuImageName;
      params['menu_id'] = this.currentID;
      params['menu_option_price'] = this.menu_option_price;
      this.json.post('s/menu_mgmt_api/set_menu_data/', params).subscribe((response?: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          if (response.result) {
            this.currentID = response.data;
            // this.saved.emit();
            this.dialogRef.close(true);
          }
        }
      });
    }
  }

  // レシピ追加
  onAddRecipe() {
    this.recipe.push(this.fb.group({
      // 材料ID
      ing_id: null,
      // 分量
      serving: 0,
      // 使用量
      amount_to_use: 0,
      // 消費単位
      consumption_unit: '',
      // 在庫単位
      stock_unit: ['', []],
      // レート
      unit_conv_rate: ['', []],
      // 平均単価
      ave_price: ['', []],
      // レシピコスト
      recipe_cost: ''
    })
    );
  }

  // 写真選択
  onSelectPhoto() {
    this.fileInput.nativeElement.click();
  }

  // 写真読み込み
  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;

    Object.keys(files).forEach(key => {
      const reader = new FileReader();
      reader.readAsDataURL(files[key]);
      reader.onload = (event) => {
        if (
          String(reader.result).indexOf('data:image/jpeg;base64,') >= 0
          || String(reader.result).indexOf('data:image/png;base64,') >= 0
        ) {
          this.menuImage = reader.result;
          this.menuImageSize = event.loaded;
          this.menuImageName = files[key].name;
          this.image = '';
        } else {
          this.cmp.pop('対応しないファイル形式です。jpg、pngファイルを登録してください。');
        }
      };
    });
  }

  // 写真削除
  onDeletePhoto() {
    this.cmp.confirm('写真を削除しますか？').afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.fileInput.nativeElement.value = '';
        this.menuImage = '';
        this.image = '';
      }
    });
  }

  changePrice(event, item) {
    console.info(event);
    item['price'] = event.target.value;
  }

  onChange(val, price=null) {
    // this.menu_option_price = [];
    // tslint:disable-next-line: forin
    const result = [];
    for ( const i in this.menu_option_price ) {
      if ( val.indexOf(this.menu_option_price[i]['id']) !== -1 ) {
        result.push(this.menu_option_price[i]);
      }
    }
    this.menu_option_price = result;

    // tslint:disable-next-line: forin
    for (const i in val) {
      let isNew = true;
      for( const n in this.menu_option_price ) {
        if ( val[i]==this.menu_option_price[n]['id'] ) {
          isNew = false;
          break;
        }
      }
      if ( isNew ) {
        let cur_price = 0;
        if ( !Util.isEmpty(price) && !Util.isEmpty(price[i]) ) {
          cur_price = price[i];
        }
        this.menu_option_price.push( {
          id: val[i],
          price: cur_price
        });
      }
    }
  }
  showDisplayName (id) {
    if ( Object.values(this.map_menu_option).length==0 ) {
      // tslint:disable-next-line: forin
      for (const i in this.menu_options) {
        const group = this.menu_options[i]['children'];
        // tslint:disable-next-line: forin
        for ( const n in group ) {
          this.map_menu_option[group[n]['id']] = Util.clone( group[n] );
          this.map_menu_option[group[n]['id']]['display_name'] = this.menu_options[i]['display_name'] + '-' + group[n]['display_name'];
        }
      }
    }

    if ( Util.isEmpty(this.map_menu_option[id]) ) {
      return id;
    } else {
      return this.map_menu_option[id]['display_name'];
    }
  }


}
