import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { HomeService } from '../../home/home.service';
import { CmpService } from '../../cmp/cmp.service';
import { JsonService, Util } from 'ami';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ManagerService } from '../manager.service';
import { environment } from 'projects/restaurant/src/environments/environment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';


// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'menu-category',
  templateUrl: './menu-category.component.html',
  styleUrls: ['./menu-category.component.css']
})
export class MenuCategoryComponent implements OnInit, AfterViewChecked {

  sort_model = false;

  list = [];

  master_group = [];
  current_master_group = 0;

  // 選択中master_groupのすべてのデータ
  master_group_menus = [];

  // すべてのメニューデータ
  orign_menus = [];

  // カテゴリーに追加可能なメニュー
  menus = [];

  isUnSetOnly = true;

  menu_categorys = [];

  constructor(
    private fb: FormBuilder,
    private service: HomeService,
    private route: ActivatedRoute,
    private cmp: CmpService,
    private jsonSrv: JsonService,
    private managerSrv: ManagerService
  ) {

    const params = this.route.snapshot.params;
    let name = '';
    if ( !Util.isEmpty(params['name']) ) {
      name = params['name'];
    }
    this.route.params.subscribe(data=>{
      name = data['name'];
      this.init(name);
    });
  }


  init(name) {
    const domain = 'menu_category';
    this.master_group = [];
    this.orign_menus = [];
    this.jsonSrv.get('master/master/', {domain__in: domain, name: name}).subscribe((response?: any[]) => {
      if (!Util.isEmpty(response) && response[0]) {
        response.forEach((item) => {
          if (Util.isEmpty(name) ) {
            if(item['name'] != 'menu_category_standard') {
              this.master_group.push(item);
            }
          } else {
            this.master_group.push(item);
          }
        });
        // this.master_group = response;
        this.master_group.forEach((item: any) => {
          item.index = 0;
        });
        this.refreshTitle();
      }
    });


    this.jsonSrv.get('restaurant/menu/menu_list/', {}).subscribe((response?: any[]) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.orign_menus = response;
        this.orign_menus.forEach((menu) => {
          menu.selected = false;
          this.menus.push(menu);
        });
      }
    });

    // this.service.changeToolbar('テーブルA');
    // this.cmp.pop('また利用不可です、スタッフに声掛けてください。', 3000);
  }

  ngOnInit() {
  }

  refresh() {
    this.loadMenuCategory();
  }

  sortEdit(event) {
    this.sort_model = true;
  }

  changeMenu(event, menu) {
    const url = environment.api_ip + '/admin/master/menu/' + menu.menu_id + '/change/'
    window.open(url, menu.id);
  }

  onDown(event, menu, index) {
    this.menu_categorys.splice(index, 1);
    this.menu_categorys.splice(index + 1, 0, menu);
  }

  onUp(event, menu, index) {
    this.menu_categorys.splice(index, 1);
    this.menu_categorys.splice(index - 1, 0, menu);
  }

  sortSave(event) {
    this.sort_model = false;
    let index = 0;
    this.menu_categorys.forEach((category) => {
      category.display_order = index;
      index++;
    });


    this.jsonSrv.update('master/menucategory/0/', this.menu_categorys).subscribe((response?: any[]) => {
      this.loadMenuCategory();
    });
  }


  sortCancel(event) {
    this.sort_model = false;
    this.loadMenuCategory();
  }

  getCurrentCategory() {
    if ( Util.isEmpty(this.master_group[this.current_master_group]) ) { return ;}
    return this.master_group[this.current_master_group].master_data[this.master_group[this.current_master_group].index];
  }

  loadMenuCategory() {
    this.menu_categorys = [];
    if ( Util.isEmpty(this.master_group[this.current_master_group]) ) { return; }
    // tslint:disable-next-line: max-line-length
    this.jsonSrv.get('restaurant/menu/menucategory/', { category_group: this.master_group[this.current_master_group].id }).subscribe((response?: any[]) => {

      if (!Util.isEmpty(response) && response[0]) {
        this.master_group_menus = response;
      } else {
        this.master_group_menus = [];
      }

      const master = this.getCurrentCategory();
      this.menu_categorys = this.master_group_menus.filter((data) => {
        return data.category === master.id;
      });

      // メニューデータ設定
      this.init_menus();

      if (response && response['error']) {
        this.cmp.pop(response['error']);
      }

    });
  }

  init_menus() {
    this.menus = this.orign_menus.filter((menu) => {
      let index = -1;

      if (this.isUnSetOnly) {
        index = this.master_group_menus.findIndex((category) => {
          return category.menu === menu.id;
        });
      } else {
        index = this.menu_categorys.findIndex((category) => {
          return category.menu === menu.id;
        });

      }

      return index < 0;
    });
  }


  addMenu(event, menu) {
    event.disabled = true;
    const master = this.getCurrentCategory();
    menu.selected = false;
    const data = {
      category: master.id,
      menu: menu.id
    };
    const menu_data = [];
    this.menus.forEach((item) => {
      if (menu.id != item.id) {
        menu_data.push(item);
      }
    });
    // 
    this.menus = menu_data;
    this.jsonSrv.create('master/menucategory/', data).subscribe((response?: any[]) => {
      if (response && response['id']) {
        // this.loadMenuCategory(false);
        this.menu_categorys.push(response);
      }

      if (response && response['error']) {
        this.cmp.pop(response['error']);
      }
    });
  }

  removeMenu(event, menu) {
    menu.selected = false;
    this.menu_categorys = this.menu_categorys.filter((data) => {
      return data.id !== menu.id;
    });
    this.jsonSrv.delete('master/menucategory/' + menu.id + '/', {}).subscribe((response) => {
      // this.loadMenuCategory();
      // メニューデータ設定
      this.menus = this.orign_menus.filter((m) => {
        let index = -1;
        index = this.menu_categorys.findIndex((category) => {
          return category.menu === m.id;
        });

        return index < 0;
      });
    });
  }

  addMultipleMenu(event) {
    const master = this.getCurrentCategory();
    const data = [];

    this.menus.forEach((menu) => {
      if (menu.selected === true) {
        data.push({
          category: master.id,
          menu: menu.id
        });
        menu.selected = false;
      }
    });

    this.jsonSrv.create('master/menucategory/', data).subscribe((response?: any) => {
      this.loadMenuCategory();
    });

  }


  removeMultipleMenu(event) {
    const data = [];

    this.menu_categorys.forEach((menu) => {
      if (menu.selected === true) {
        data.push(menu.id);
        menu.selected = false;
      }
    });

    this.jsonSrv.delete('master/menucategory/' + data.toString() + '/').subscribe((response?: any) => {


      this.loadMenuCategory();
      // if (response && response['error'])
      //   this.cmp.pop(response['error']);
    });
  }

  onCheckAllChange(event) {
    this.loadMenuCategory();
    this.isUnSetOnly = event.checked;
  }

  onCheckChange(event, menu) {
    menu.selected = event.checked;
  }

  onCategoryChange(event) {
    this.current_master_group = event.index;
    this.loadMenuCategory();
    this.refreshTitle();
  }

  onMenuCategoryChange(event) {
    this.master_group[this.current_master_group].index = event.index;
    this.loadMenuCategory();
    this.refreshTitle();

  }

  refreshTitle() {
    if (Util.isEmpty(this.master_group[this.current_master_group]) ) { return ; }
    const master = this.getCurrentCategory();
    const title = 'メニューカテゴリー'
      + '　>>　' + this.master_group[this.current_master_group].display_name
      + '　>>　' + master.display_name;

    this.managerSrv.changeToolbar(title);
  }

  preview($event) {

  }

  ngAfterViewChecked(): void {

  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.sort_model) {
      moveItemInArray(this.menu_categorys, event.previousIndex, event.currentIndex);
    } else {
      return false;
    }
  }
}