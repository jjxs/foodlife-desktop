import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from '../home/home.service';
import { CmpService } from '../cmp/cmp.service';
import { JsonService } from 'ami';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ManagerService } from './manager.service';
import { MatSidenav, MatSlideToggle } from '@angular/material';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';


// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  currentJustify = 'start';

  list = [];

  title = "管理画面";

  @ViewChild("sidenav", {static: false}) public sidenav: MatSidenav;
  @ViewChild("slideToggle", {static: false}) public slideToggle: MatSlideToggle;

  constructor(
    private fb: FormBuilder,
    private homeSvr: HomeService,
    private cmp: CmpService,
    private router: Router,
    private jsonSrv: JsonService,
    private managerSrv: ManagerService
  ) {
    for (let index = 0; index < 20; index++) {
      this.list.push(index);
    }

    this.managerSrv.changeToolbar$.subscribe((title) => {
      this.title = title;
    });
    this.managerSrv.showPanel$.subscribe((shown) => {
      this.slideToggle.checked = shown;
      if (shown === true) {
        this.sidenav.close();
      } else {
        this.sidenav.open();
      }
    });

  }
  ngOnInit() {

    this.homeSvr.showHeader(true);
    this.jsonSrv.get('master');

    // this.service.changeToolbar("テーブルA");
    // this.cmp.pop("また利用不可です、スタッフに声掛けてください。", 3000);
  }

  changePanel(event) {
    if (event.checked === true) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
  }

  gotoManageTop(id) {
    this.router.navigate(['/manager/top', { theme: id }]);
  }

  gotoManageMenuCat(id='') {
    this.router.navigate(['/manager/menu-category', { name: id }]);
  }
}