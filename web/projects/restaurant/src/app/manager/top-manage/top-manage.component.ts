import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { HomeService } from '../../home/home.service';
import { CmpService } from '../../cmp/cmp.service';
import { JsonService, Util } from 'ami';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ManagerService } from '../manager.service';
import { CategoryChangedEvent } from '../../menu/menu.interface';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';


// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'top-manage',
  templateUrl: './top-manage.component.html',
  styleUrls: ['./top-manage.component.css']
})
export class TopManageComponent implements OnInit {

  list = [];

  // すべてのメニューデータ
  orign_menus = [];

  // 現在のカテゴリー（現在ページ）で、表示するデータ
  menu_data = [];
  max_page = 0; s

  menu_page = [];
  menu_page_position = {};
  menu_page_category = {};

  current_page = 0;
  category_value = '';
  theme = 'top1';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private managerSrv: ManagerService
  ) {
    this.route.params.subscribe(data=>{
      this.theme = data['theme'];
    });
    this.theme = this.route.snapshot.params['theme'];
  }


  ngOnInit() {
    this.managerSrv.changeToolbar("Top管理");

    this.managerSrv.showPanel(false);

  }

}