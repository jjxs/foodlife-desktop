import { Component, OnInit, Inject } from '@angular/core';
import { ManagerService } from '../manager.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MenuTop, MenuCategory } from '../../menu/menu.interface';
import { JsonService, Util, AuthenticationService } from 'ami';
import { CmpService } from '../../cmp/cmp.service';
import { MenuService } from '../../menu/menu.service';


// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'menu-bind-edit',
  templateUrl: './menu-bind-edit.component.html',
  styleUrls: ['./menu-bind-edit.component.css']
})
export class MenuBindEditComponent implements OnInit {
  item;
  bind_id = 0;
  menu_binds = [];
  menus = null;
  master_group = [];
  orign_menus = [];

  current_master_group = 0;

  current_group_data = [];

  constructor(
    private managerSrv: ManagerService,
    public dialogRef: MatDialogRef<MenuBindEditComponent>,
    private jsonSrv: JsonService,
    private cmp: CmpService,
    private menuSrv: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.item = data['item'];
    if  (this.item && this.item['bind_id'] ) {
      this.bind_id = this.item['bind_id'];
    }
    // this.menu_binds = this.item['menu'];
    this.getMenuList();


    this.master_group = [];
    this.orign_menus = [];
    this.jsonSrv.get('master/master/?domain__in=menu_category', {}).subscribe((response?: any[]) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.master_group = response;
        this.master_group.forEach((item: any) => {
          item.index = 0;
        });
        // this.refreshTitle();
      }
    });

  }

  getMenuList() {
    this.jsonSrv.get('restaurant/menu/menu_list/', {}).subscribe((response?: any[]) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.orign_menus = response;
        // tslint:disable-next-line: forin
        for(var i in this.orign_menus) {
          let has = this.item['menu'].findIndex((detail) => {
            return detail.menu_id === this.orign_menus[i]['id'];
          });
          if ( has >= 0 ) {
            this.menu_binds.push(this.orign_menus[i]);
          }
        }
      }
    });
  }

  loadMenuList() {
    let group_id = this.master_group[this.current_master_group].id;
    this.jsonSrv.get('restaurant/menu/menucategory/', { category_group: group_id }).subscribe((response?: Array<MenuCategory>) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.current_group_data = response;
        this.changeMenuData(this.orign_menus);
      }
    });
  }

  changeMenuData(orign_menus) {
    this.menus = orign_menus.filter((menu) => {
      let has = this.menu_binds.findIndex((detail) => {
        return detail.id === menu.id;
      });
      if ( has >= 0 ) {
        return false;
      }

      let index = this.current_group_data.findIndex((category) => {
        return category.menu_id === menu.id;
      });
      return index >= 0;
    });
  }

  ngOnInit() {
  }

  addMenu(event, menu) {
    this.menu_binds.push(menu);
    this.changeMenuData(this.orign_menus);
  }

  removeMenu(event, menu) {
    this.menu_binds = this.menu_binds.filter((detail) => {
      return detail.id !== menu.id;
    });
    this.changeMenuData(this.orign_menus);
  }

  onCategoryChange(event) {
    this.current_master_group = event.index;
    this.loadMenuList()
  }

  save(evnet) {
    let menu_binds = [];
    // tslint:disable-next-line: forin
    for(var i in this.menu_binds) {
      menu_binds.push(this.menu_binds[i]['id']);
    }
    let params = {
      'menu_ids' : menu_binds,
      'bind_id': this.bind_id
    };
    this.jsonSrv.post('restaurant/menu/post_bind/', params).subscribe((response?) => {
      if (response && response["message"]) {
          this.cmp.pop(response["message"]);
          if (response['bind_id']) {
            this.bind_id = response['bind_id'];
            this.dialogRef.close();
          }
      }
    });
  }
}