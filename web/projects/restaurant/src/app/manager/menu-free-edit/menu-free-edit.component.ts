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
  selector: 'menu-free-edit',
  templateUrl: './menu-free-edit.component.html',
  styleUrls: ['./menu-free-edit.component.css']
})
export class MenuFreeEditComponent implements OnInit {
  menu_free_id = 0
  menu_free_detail = []
  menus = null
  master_group = [];
  orign_menus = [];

  menu_id = ''
  free_type_id = 0

  current_master_group = 0;

  current_group_data = []

  constructor(
    private managerSrv: ManagerService,
    public dialogRef: MatDialogRef<MenuFreeEditComponent>,
    private jsonSrv: JsonService,
    private cmp: CmpService,
    private menuSrv: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.menu_free_id = data['menu_free_id']
    this.free_type_id = data['free_type_id']
    this.menu_id = data['menu_id']
    this.getMenuList()
    this.getDetail(this.menu_free_id)

    
    this.master_group = [];
    this.orign_menus = [];
    this.jsonSrv.get('master/master/?domain__in=menu_category', {}).subscribe((response?: any[]) => {
      let array = [];
      if (!Util.isEmpty(response) && response[0]) {
        this.master_group = response;
        this.master_group.forEach((item: any) => {
          item.index = 0;
        })
        // this.refreshTitle();
      }
    });

  }

  getDetail(menu_free_id) {
    this.jsonSrv.get('restaurant/menu/free_detail/', {menu_free_id: menu_free_id}).subscribe((response?: any[]) => {
      if (Util.isEmpty(response)) {
        return;
      }
      this.menu_free_detail = response
    })
  }

  getMenuList() {
    this.jsonSrv.get('restaurant/menu/menu_list/', {}).subscribe((response?: any[]) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.orign_menus = response;
      }
    });
  }

  loadMenuList() {
    let group_id = this.master_group[this.current_master_group].id
    this.jsonSrv.get('restaurant/menu/menucategory/', { category_group: group_id }).subscribe((response?: Array<MenuCategory>) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.current_group_data = response
        this.changeMenuData(this.orign_menus)
      }
    })
  }

  changeMenuData(orign_menus) {
    this.menus = orign_menus.filter((menu) => {
      let has = this.menu_free_detail.findIndex((detail) => {
        return detail.id === menu.id
      })
      if ( has>=0 ) {
        return false;
      }

      let index = this.current_group_data.findIndex((category) => {
        return category.menu_id === menu.id;
      });
      return index >= 0;
    })
  }

  ngOnInit() {
  }

  addMenu(event, menu) {
    this.menu_free_detail.push(menu)
    this.changeMenuData(this.orign_menus)
  }

  removeMenu(event, menu) {
    this.menu_free_detail = this.menu_free_detail.filter((detail) => {
      return detail.id !== menu.id
    })
    this.changeMenuData(this.orign_menus)
  }

  onCategoryChange(event) {
    this.current_master_group = event.index;
    this.loadMenuList()
  }

  save(evnet) {
    console.info(this.menu_free_id, this.menu_free_detail)
    let menu_free_detail = []
    for(var i in this.menu_free_detail) {
      menu_free_detail.push(this.menu_free_detail[i]['id'])
    }
    let params = {
      'menu_free_id': this.menu_free_id,
      'menu_id': this.menu_id,
      'free_type_id': this.free_type_id,
      'menu_free_detail' : menu_free_detail
    }
    this.jsonSrv.post('restaurant/menu/post_free/', params).subscribe((response?) => {
      if (response && response["message"]) {
          this.cmp.pop(response["message"]);
          this.menu_free_id = response['id']
          this.dialogRef.close();
      }
    });
  }

}