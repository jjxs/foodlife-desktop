import { Component, OnInit, Inject } from '@angular/core';
import { JsonService, Util } from 'ami';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MenuService } from '../menu.service';
import { Menu } from '../menu.interface';
import { CounterService } from '../../counter/counter.service';

@Component({
  selector: 'restaurant-menu-view',
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.css']
})
export class MenuViewComponent implements OnInit {

  count = 1;
  menu: Menu;
  onOrder: 0;
  enableOrder = true;
  menu_options = [];
  site_image_host = '';
  constructor(
    public counterSrv: CounterService,
    private jsonSrv: JsonService,
    public dialogRef: MatDialogRef<MenuViewComponent>,
    public menuSrv: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.site_image_host = this.menuSrv.appService.SiteImageHost + '/';
      this.menu = data.menu;
      // tslint:disable-next-line: forin
      for ( const i in this.menu.menu_options ) {
        this.menu_options.push(this.menu.menu_options[i]);
      }
      this.onOrder = data.onOrder;
      this.enableOrder = data.enableOrder;
    }

  ngOnInit() {
  }

  order() {
    const list = [];
    list.push({
      count: this.count,
      menu:  this.menu
    });
    this.menuSrv.sendOrder(list);
    this.dialogRef.close({});
  }

  ok() {
    this.menuSrv.addOrder(this.menu, this.count);
    this.dialogRef.close({});
  }

  close(): void {
    this.dialogRef.close(null);
  }


  onSpec(item, group) {
    // tslint:disable-next-line: forin
    for ( const i in group['items'] ) {
      if ( group['items'][i]['on'] === undefined
        || group['items'][i]['id'] !== item['id']) {
        group['items'][i]['on'] = 0;
      }
    }
    if ( item['on'] === 0 ) {
      item['on'] = 1;
      group['select_name'] = item['display_name'];
    } else {
      item['on'] = 0;
      group['select_name'] = false;
    }

  }

  srcError(event) {
    try {
      const src = '/assets/images/menu/' + this.menu.no + '.jpg';
      if ( event.srcElement.src != src ) {
        this.menu.image = src;
        this.site_image_host = '';
      }
    } catch (e) {

    }
  }

}
