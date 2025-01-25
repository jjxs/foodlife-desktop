import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonToggleGroup, MatButtonToggleChange } from '@angular/material';
import { CmpService, JsonService, JsonResult } from 'app-lib';
import { ShopCostCatRegComponent } from './shop-cost-cat/shop-cost-cat-reg/shop-cost-cat-reg.component';
import { ShopCostListComponent } from './shop-cost-list/shop-cost-list.component';
import { ShopCostCatComponent } from './shop-cost-cat/shop-cost-cat.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { MatDialog } from '@angular/material';
import { Util, AuthenticationService } from 'ami';
import { ShopCostEditComponent } from './shop-cost-edit/shop-cost-edit.component';
import { SupplierEditComponent } from './supplier-edit/supplier-edit.component';



@Component({
  selector: 'app-shop-cost',
  templateUrl: './shop-cost.component.html',
  styleUrls: ['./shop-cost.component.css']
})
export class ShopCostComponent implements OnInit {

  menuData = [];

  @ViewChild('ingList', { static: false }) ingList: ShopCostListComponent;
  @ViewChild('catList', { static: false }) catList: ShopCostCatComponent;
  @ViewChild('supList', { static: false }) supList: SupplierListComponent;

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

    private dialog: MatDialog,
    private jsonSrv: JsonService,

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
    if (list === 'sup') {
      this.supList.onSearch();
    }
  }

  onEditIng(event) {
    if (typeof event === 'boolean') {
      this.editFlg = false;
      if (event) {
        this.json.post('s/shop_cost_api/get_edit_data', {}).subscribe((response: JsonResult) => {
          if (response.data) {
            this.ingData = {
              categories: response.data.categories
            };
            const dialog = this.dialog.open(ShopCostEditComponent, {
              width: '650px',
              height: '480px',
              data: this.ingData,
            })
            dialog.afterClosed().subscribe(result => {
              if(result){
                this.onRefresh('ing');
              }
            });
          }
        });
      }
    } else {
      this.editFlg = false;
      this.json.post('s/shop_cost_api/get_edit_data', { id: event }).subscribe((response: JsonResult) => {
        if (response.data) {
          this.ingData = {
            result: response.data.result,
            categories: response.data.categories
          };
        }
        const dialog = this.dialog.open(ShopCostEditComponent, {
          width: '650px',
          height: '480px',
          data: this.ingData
        })
        dialog.afterClosed().subscribe(result => {
          if(result){
            this.onRefresh('ing');
          }
        });
      });
    }
  }
  onEditSup(event) {
    const dialog = this.dialog.open(SupplierEditComponent, {
      width: '650px',
      height: '350px',
      data: event
    })
    dialog.afterClosed().subscribe(result => {
      if(result){
        this.onRefresh('sup');
      }
    });
  }

  onEditCat(event) {
    if (typeof event === 'boolean') {
      this.catFlg = false;
      if (event) {
        this.json.post('s/shop_cost_api/get_cat_edit_data', {}).subscribe((response: JsonResult) => {
          if (response.data) {
            this.catData = {
              parents: response.data.parents
            };
          }
          const dialog = this.dialog.open(ShopCostCatRegComponent, {
            width: '650px',
            height: '350px',
            data: this.catData 
          })
          dialog.afterClosed().subscribe(result => {
            if(result){
              this.onRefresh('cat');
            }
          });
        });
      }
    } else {
      this.catFlg = false;
      this.json.post('s/shop_cost_api/get_cat_edit_data', { id: event }).subscribe((response: JsonResult) => {
        if (response.data) {
          this.catData = {
            result: response.data.result,
            parents: response.data.parents
          };
        }
        const dialog = this.dialog.open(ShopCostCatRegComponent, {
          width: '650px',
          height: '350px',
          data:this.catData
        })
        dialog.afterClosed().subscribe(result => {
          if(result){
            this.onRefresh('cat');
          }
        });
      });
    }
  }
}
