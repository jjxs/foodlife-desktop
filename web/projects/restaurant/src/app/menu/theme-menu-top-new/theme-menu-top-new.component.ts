import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuService } from '../menu.service';
import { MatDialog } from '@angular/material';
import { MenuViewComponent } from '../menu-view/menu-view.component';
import { Menu } from '../menu.interface';
import { CounterService } from '../../counter/counter.service';
import { Util } from 'projects/guest/src/app/ami/util';

@Component({
  selector: 'restaurant-theme-menu-top-new',
  templateUrl: './theme-menu-top-new.component.html',
  styleUrls: ['./theme-menu-top-new.component.css']
})
export class ThemeMenuTopNewComponent implements OnInit {

  imageUrl = '/assets/images/addbutton.png';

  @Input() menu: Menu;

  @Input() enableOrder = true;

  // 割引率で算出した価格
  @Input() newPrice = 0;

  site_image_host = '';
  
  freeClass = {
    'text-decoration': (this.menu && this.menu.is_free) ? 'line-through' : 'none'
  }

  constructor(
    public counterSrv: CounterService,
    private menuSrv: MenuService,
    private dialog: MatDialog) {
       this.site_image_host = this.menuSrv.appService.SiteImageHost + '/';
    }

  ngOnInit() {

  }

  onClick(event) {

    event.stopPropagation();
    //console.log(event);
    if (this.menu.id) {
      const dialog = this.dialog.open(MenuViewComponent, {
        width: '450px',
        data: {
          menu: this.menu,
          // onOrder: 1,
          enableOrder: this.enableOrder
        }
      });
    }
  }

  onOrder(event) {
    event.stopPropagation();
    //console.log(event);
    if (this.menu && this.menu.id) {
      this.menuSrv.addOrder(this.menu);
    }
  }

  srcError(event) {
    try {
      //event.srcElement.src = '/assets/images/menu/notfound.jpg'
    } catch (e) {

    }

  }

  mousedown(event) {
    event.target.src = '/assets/images/pushbutton.png';
  }

  mouseup(event) {
    setTimeout(function () {
      event.target.src = '/assets/images/addbutton.png';
    }, 100);

  }

}
