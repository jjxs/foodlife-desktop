import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuViewComponent } from '../menu-view/menu-view.component';
import { Menu, MenuCategory } from '../menu.interface';
import { CounterService } from '../../counter/counter.service';
import { JsonService, Util, AuthenticationService } from 'ami';
import { MatDialog } from '@angular/material';
import { MenuService } from '../menu.service';

@Component({
  selector: 'restaurant-theme-menu-top-ranking',
  templateUrl: './theme-menu-top-ranking.component.html',
  styleUrls: ['./theme-menu-top-ranking.component.css']
})
export class ThemeMenuTopRankingComponent implements OnInit {
  @Input() enableOrder = true;

  menuData: Array<Menu> = []

  // すべてのメニューデータ
  orign_menus = null;
  lang;

  constructor(
    public menuSrv: MenuService,
    public counterSrv: CounterService,
    private jsonSrv: JsonService,
    private dialog: MatDialog
    ) {
    }

  ngOnInit() {
    this.jsonSrv.get('restaurant/menu/ranking/', { }).subscribe((response?: Array<MenuCategory>) => {
      if (Util.isEmpty(response) || Util.isEmpty(response[0])) {
        // this.cmp.unloading(500);
        return;
      }
      if (!Util.isEmpty(response) && response[0]) {
        response.forEach((row: any) => {
          this.menuData.push(row)
        });
      }
    });
    this.orign_menus = this.menuSrv.getMenuList();
  }

  onClick(event, id) {
    event.stopPropagation();
    let menu: Menu;
    let menu_id = this.menuData[id]['menu_id'];
    menu = this.orign_menus[menu_id];
    const dialog = this.dialog.open(MenuViewComponent, {
      width: '450px',
      data: {
        menu: menu,
        // onOrder: 1,
        enableOrder: this.enableOrder
      }
    });
  }

}
