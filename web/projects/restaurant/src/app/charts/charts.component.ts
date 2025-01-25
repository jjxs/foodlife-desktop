import { Component, OnInit, ViewChild, Injectable  } from '@angular/core';
import { HomeService } from '../home/home.service';
import { CmpService } from '../cmp/cmp.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChartsService } from './charts.service';
import { MatSidenav, MatSlideToggle } from '@angular/material';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { JsonService, Util, AuthenticationService } from 'ami';


// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  currentJustify = 'start';

  title = '経営分析';
  chart_list = [
    {
      key : 'week',
      val : '曜日別売上統計表'
    }, {
      key : 'day',
      val : '日別売上統計表'
    }, {
      key : 'month',
      val : '月別売上統計表'
    }, {
      key : 'cat',
      val : '料理分類別売上統計表'
    }, {
      key : 'menu',
      val : '料理売上統計表'
    }, {
      key : 'profit',
      val : '料理売上利益統計表'
    }, {
      key : 'table',
      val : 'テーブル別売上統計表'
    }
  ];

  tab_index = 0;

  @ViewChild('sidenav', {static: false}) public sidenav: MatSidenav;
  @ViewChild('slideToggle', {static: false}) public slideToggle: MatSlideToggle;

  constructor(
    private fb: FormBuilder,
    public authSrv: AuthenticationService,
    private homeSvr: HomeService,
    private cmp: CmpService,
    private router: Router,
    private jsonSrv: JsonService,
    private chartsSrv: ChartsService
  ) {
    this.homeSvr.showHeader(false);
  }
  ngOnInit() {
    this.homeSvr.showHeader(false);
    this.router.navigate(['/charts/chart-top', {}]);
    this.getWeekData();

  }

  // tabChange(event) {
  //   this.tab_index = event;
  // }

  goHome() {
    this.homeSvr.showHeader(true);
    this.router.navigate(['/menu', {}]);
  }

  getWeekData() {

  }

  logout() {
    const dialog = this.cmp.confirm('ログアウトしますか？');
    dialog.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.authSrv.logout();
        this.authSrv.init();
        location.href = '/';
      }
    });
  }
}