import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonToggleGroup, MatButtonToggleChange } from '@angular/material';
import { CmpService, JsonService, JsonResult } from 'app-lib';
import { IngredientsListComponent } from './ingredients-list/ingredients-list.component';
import { IngredientsCatComponent } from './ingredients-cat/ingredients-cat.component';
import { MatDialog } from '@angular/material';
import { Util, AuthenticationService } from 'ami';
import { IngredientsEditComponent } from './ingredients-edit/ingredients-edit.component';
import { CatRegComponent } from './ingredients-cat/cat-reg/cat-reg.component';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  // 
  menuData = [];
  // 
  @ViewChild('ingList', { static: false }) ingList: IngredientsListComponent;
  @ViewChild('catList', { static: false }) catList: IngredientsCatComponent;

  // 一覧切り替え
  listSwitch = 'I';
  // 編集フラグ
  editFlg = false;
  // カテゴリーフラグ
  catFlg = false;
  // 材料編集データ
  ingData = {};
  // カテゴリー編集データ
  catData = {};

  constructor(
    // 
    private dialog: MatDialog,
    private jsonSrv: JsonService,
    // 
    private fb: FormBuilder,
    private json: JsonService,
    private cmp: CmpService
  ) { }

  ngOnInit() {
  }

  onRefresh(list) {
    if (list === 'ing') {
      this.ingList.onSearch();
    }
    if (list === 'cat') {
      this.catList.onSearch();
    }
  }

  onEditIng(event) {
    if (typeof event === 'boolean') {
      this.editFlg = false; //画面に遷移
      if (event) {
        this.json.post('s/ingredients_api/get_edit_data', {}).subscribe((response: JsonResult) => {
          if (response.data) {
            this.ingData = {
              categories: response.data.categories
            };
            const dialog = this.dialog.open(IngredientsEditComponent, {
              width: '700px',
              height: '620px',
              data: this.ingData,
            })
            dialog.afterClosed().subscribe(result => {
              if (result == "1") {
                this.onRefresh('ing')
              }
            });
          }
        });
      }
    } else {
      this.editFlg = false;
      this.json.post('s/ingredients_api/get_edit_data', { id: event }).subscribe((response: JsonResult) => {
        if (response.data) {
          this.ingData = {
            result: response.data.result,
            categories: response.data.categories
          };
        }
        const dialog = this.dialog.open(IngredientsEditComponent, {
          width: '700px',
          height: '620px',
          data: this.ingData
        })
        dialog.afterClosed().subscribe(result => {
          if (result == "1") {
            this.onRefresh('ing')
          }
        });
      });
    }
  }

  onEditCat(event) {
    if (typeof event === 'boolean') {
      this.catFlg = false;
      if (event) {
        this.json.post('s/ingredients_api/get_cat_edit_data', {}).subscribe((response: JsonResult) => {
          if (response.data) {
            this.catData = {
              parents: response.data.parents
            };
          }
          const dialog = this.dialog.open(CatRegComponent, {
            width: '700px',
            height: '420px',
            data: this.catData
          })
          dialog.afterClosed().subscribe(result => {
            if (result == "1") {
              this.onRefresh('cat')
            }
          });
        });
      }
    } else {
      this.catFlg = false;
      this.json.post('s/ingredients_api/get_cat_edit_data', { id: event }).subscribe((response: JsonResult) => {
        if (response.data) {
          this.catData = {
            result: response.data.result,
            parents: response.data.parents
          };
        }
        const dialog = this.dialog.open(CatRegComponent, {
          width: '700px',
          height: '420px',
          data: this.catData
        })
        dialog.afterClosed().subscribe(result => {
          if (result == "1") {
            this.onRefresh('cat')
          }
        });
      });
    }
  }

}
