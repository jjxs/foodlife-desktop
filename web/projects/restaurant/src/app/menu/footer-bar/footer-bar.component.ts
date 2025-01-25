import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Menu } from '../menu.interface';
import { MenuService, ViewChangedEvent } from '../menu.service';
import { style, trigger, state, transition, animate, keyframes } from '@angular/animations';
import { Router } from '@angular/router';
import { JsonService } from 'ami';
import { MatDialog } from '@angular/material';
import { MenuLanguageComponent } from '../menu-language/menu-language.component';


@Component({
  selector: 'restaurant-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.css'],
  animations: [
  ]
})
export class FooterBarComponent implements OnInit{

  @Input() menu = 'top';

  @Input() seat = -1;

  lang;
  constructor(
    public menuSrv: MenuService,
    private jsonSrv: JsonService,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnDestroy() {
  }

  ngOnInit() {
  }

  btnClick(goto) {
    this.menuSrv.menuChanged(goto);
  }

  // 店員呼び出し
  calling = false;
  callStaff(event) {
    this.calling = true;
    setTimeout(() => {
      this.calling = false;
    }, 15000);
    this.jsonSrv.post('restaurant/menu/call_staff/', { seat: this.seat }).subscribe((response?) => {
    });
  }

  language() {
    const dialog = this.dialog.open(MenuLanguageComponent, {
      width: '400px',
      height: '240px',
      data: {
      }
    });
    dialog.afterClosed().subscribe(result => {
    });
  }

}
