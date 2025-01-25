import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuService } from '../menu.service';
import { MatDialog } from '@angular/material';
import { MenuViewComponent } from '../menu-view/menu-view.component';
import { Menu } from '../menu.interface';
import { CounterService } from '../../counter/counter.service';
import { Util } from 'projects/guest/src/app/ami/util';

@Component({
  selector: 'restaurant-menu-image',
  templateUrl: './menu-image.component.html',
  styleUrls: ['./menu-image.component.css']
})
export class MenuImageComponent implements OnInit {

  imageUrl = '/assets/images/addbutton.png';

  @Input() menu: Menu;

  @Input() showIntro = false;

  @Input() enableOrder = true;

  site_image_host = '';

  lang;

  // 割引率で算出した価格
  @Input() newPrice = 0;
  freeClass = {
    'text-decoration': (this.menu && this.menu.is_free) ? 'line-through' : 'none'
  }

  constructor(
    public counterSrv: CounterService,
    public menuSrv: MenuService,
    private dialog: MatDialog) {
     this.site_image_host = this.menuSrv.appService.SiteImageHost + '/';
    }

  ngOnInit() {

  }

  onClick(event) {

    event.stopPropagation();
    if (this.menu.id) {
      const dialog = this.dialog.open(MenuViewComponent, {
        width: '450px',
        data: {
          menu: this.menu,
          enableOrder: this.enableOrder
        }
      });
    }
  }

  onOrder(event) {
    if ( Object.values(this.menu.menu_options).length > 0)  {
      this.onClick(event);
    } else {
      event.stopPropagation();
      if (this.menu && this.menu.id) {
        this.menuSrv.addOrder(this.menu);
      }
    }
  }

  srcError(event) {
    try {
      // const src = '/assets/images/menu/' + this.menu.no + '.jpg';
      // if ( event.srcElement.src != src ) {
      //   this.menu.image = src;
      //   this.site_image_host = '';
      // }
    } catch (e) {

    }

  }

  // checkTax(menu: any) {
  //   if (Util.isEmpty(menu["option"]))
  //     return false;

  //   if (Util.isEmpty(menu.option["tax"]) || !menu.option["tax"])
  //     return false;

      
  //   return true;
  // }

  mousedown(event) {
    event.target.src = '/assets/images/pushbutton.png';
  }

  mouseup(event) {
    setTimeout(function () {
      event.target.src = '/assets/images/addbutton.png';
    }, 100);

  }

}
