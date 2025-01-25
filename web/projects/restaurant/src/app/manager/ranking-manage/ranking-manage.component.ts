import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ManagerService } from '../manager.service';
import { MatDialog } from '@angular/material';
import { JsonService, Util, AuthenticationService } from 'ami';
import { CmpService } from '../../cmp/cmp.service';

// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'ranking-manage',
  templateUrl: './ranking-manage.component.html',
  styleUrls: ['./ranking-manage.component.css']
})
export class RankingManageComponent implements OnInit {

  category = [];
  limit = 15;

  top_theme = 'top1';
  top_themes = [
    {'key': 'top1', 'value': 'Top1'},
    {'key': 'top2', 'value': 'Top2'}
  ];


  constructor(
    private dialog: MatDialog,
    private jsonSrv: JsonService,
    private cmp: CmpService,
    private managerSrv: ManagerService
  ) {

    this.category = [];
    this.jsonSrv.get('master/master/?domain__in=menu_category', {}).subscribe((response?: any[]) => {
      if (!Util.isEmpty(response) && response[0]) {
        response.forEach((item: any) => {
          if (item.option && !Util.isEmpty(item.option.display) && !item.option.display) {
            return;
          } else {
            this.category = this.category.concat(item['master_data']);
          }
        });
        this.category.forEach((item: any) => {
          item.checked = false;
        })
      }
      this.getTopConfig();
      this.getConfig();
    });

  }
  getConfig() {
    this.jsonSrv.get('restaurant/master/config/', {'key': 'ranking'}).subscribe((response?: any[]) => {
      let array = [];
      if (!Util.isEmpty(response) && response['config']) {
        let config = response['config']['value'];
        this.limit = config['limit']
        this.category.forEach((item: any) => {
          config['group_id'].forEach((id: any) => {
            if( id == item['id'] ) {
              item.checked = true
              return;
            }
          });
        });
      }
    });
  }
  getTopConfig() {
    this.jsonSrv.get('restaurant/master/config/', {'key': 'top'}).subscribe((response?: any[]) => {
      let array = [];
      if (!Util.isEmpty(response) && response['config']) {
        this.top_theme = response['config']['value'];
      }
      if (Util.isEmpty(this.top_theme)) {
        this.top_theme = 'top1';
      }
    });
  }

  ngOnInit() {
    this.managerSrv.changeToolbar('Top管理');
    this.managerSrv.showPanel(false);

  }

  onClick(event, group) {
  }

  ok(event) {
    let group_id = [];
    this.category.forEach((item: any) => {
      if(item.checked) {
        group_id.push(item.id);
      }
    });
    let params = {
      'key': 'ranking',
      'value': {
        'limit': this.limit,
        'group_id': group_id
      }
    };
    this.jsonSrv.post('restaurant/master/post_config/', params).subscribe((response?) => {
      if (response && response['message']) {
        this.cmp.pop(response['message']);
      }
    });

    let top_params = {
      'key': 'top',
      'value': this.top_theme
    };
    this.jsonSrv.post('restaurant/master/post_config/', top_params).subscribe((response?) => {
      if (response && response['message']) {
        this.cmp.pop(response['message']);
      }
    });
  }

}