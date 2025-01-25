import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { JsonService, JsonResult, Util, PagingComponent, CmpService } from 'app-lib';
import { MatTableDataSource, MatSort } from '@angular/material';
import { until } from 'protractor';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { FnParam } from '@angular/compiler/src/output/output_ast';
import { MatDialog } from '@angular/material';
import { InventorycontrolCheckConfirmComponent } from '../check-confirm/check-confirm.component';

@Component({
  selector: 'app-inventorycontrol-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class InventorycontrolCheckComponent implements OnInit {

  lists = [];
  menu = [];
  ingredient = [];

  categories = [];
  parts = [];
  stock = 0;

  current_category;
  current_part;

  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private route: ActivatedRoute,
    private cmp: CmpService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.getCategory();
  }

  onSearch() {

  }
  onSave() {
    const dialog = this.dialog.open(InventorycontrolCheckConfirmComponent, {
      width: '500px',
      height: '350px',
      data: this.lists
    })
    dialog.afterClosed().subscribe(result => {
      if (result == "1") {
        this.lists = [];
        this.onCancel();
      }
    });
    // show dialog => add comment
  }

  getCategory() {
    this.json.post('s/s03p01/get_category/', {}).subscribe((response?: JsonResult) => {
      if (response.data) {
        this.categories = response.data['category'];
        this.menu = response.data['menu'];
        this.ingredient = response.data['ingredient'];
      }
    });
  }

  // 前の画面に戻る
  onCancel() {
    if(this.lists.length>0) {
        this.cmp.confirm('保存されていないデータがあります。終了してもよろしいですか？').afterClosed().subscribe(result => {
            if (result === 'yes') {
              this.router.navigateByUrl('/store/inventory-control');
            }
        });
    } else {
        this.router.navigateByUrl('/store/inventory-control');
    }
  }

  onSelectCategory(event) {
    const val = event.value;
    this.current_category = event.value;
    const index = val['id'];
    if (val['type']==1) {
      if (this.ingredient[index]) {
        this.parts = this.ingredient[index];
      }
    } else {
      if (this.menu[index]) {
        this.parts = this.menu[index];
      }
    }
  }

  onSelectPart(event) {
    const val = event.value;
    this.current_part = event.value;
  }

  add() {
    if (!this.stock) {
      this.cmp.pop('数量は必要です！入力ください。');
    } else {
      let isNew = true;
      this.lists.forEach(item => {
        if ( item['cat_type'] == this.current_category['type']  && item['data_id'] == this.current_part['id'] ) {
          item['stock'] = item['stock'] + this.stock;
          isNew = false;
        }
      });
      if ( isNew ) {
        this.lists.unshift(
            {
              'cat_id': this.current_category['id'],
              'cat_type': this.current_category['type'],
              'cat_name': this.current_category['name'],
              'data_id': this.current_part['id'],
              'data_name': this.current_part['name'],
              'stock': this.stock,
              'unit': this.current_part['unit'],
              'price': this.current_part['price']
            }
        );
      }
      this.stock = 0;
    }
  }

  del(data) {
    this.lists = this.lists.filter((item) => {
      return data!=item;
    });
  }

}
