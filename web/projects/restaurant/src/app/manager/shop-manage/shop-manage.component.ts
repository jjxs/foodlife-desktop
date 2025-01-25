import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ManagerService } from '../manager.service';
import { MatDialog } from '@angular/material';
import { JsonService, Util, AuthenticationService } from 'ami';
import { CmpService } from '../../cmp/cmp.service';
import { AppService } from '../../app.service';

// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'shop-manage',
  templateUrl: './shop-manage.component.html',
  styleUrls: ['./shop-manage.component.css']
})
export class ShopManageComponent implements OnInit {
  config_key = 'shopinfo';
  config = {
    'no':'',
    'name': '',
    'charset': '',
    'tel': '',
    'post': '',
    'addr1': '',
    'addr2': '',
    'time1': '',
    'time2': '',
    'note1': ''
  };
  charsets = [
    {
    'key': 'Shift_JIS',
    'value': 'Star'
    },
    {
      'key' : 'GBK',
      'value': 'Xprinter'
    }
  ];

  constructor(
    private dialog: MatDialog,
    private jsonSrv: JsonService,
    private cmp: CmpService,
    private app: AppService,
    private managerSrv: ManagerService
  ) {
      this.getConfig();
  }
  getConfig() {
    const params = {
      'key': this.app.shopinfo_config_key,
    };
    this.jsonSrv.get('restaurant/master/config/', params).subscribe((response?) => {
      if (!Util.isEmpty(response['config']['value'])) {
        const shop_info = response['config']['value'];
        // tslint:disable-next-line: forin
        for ( let k in shop_info ) {
          this.config[k] = shop_info[k];
        }
      }
    });
  }

  ngOnInit() {
    this.managerSrv.changeToolbar('領収書管理');
    this.managerSrv.showPanel(false);

  }

  onClick(event, group) {
  }

  ok(event) {
    const params = {
      'key': this.app.shopinfo_config_key,
      'value': this.config
    }
    this.jsonSrv.post('restaurant/master/post_config/', params).subscribe((response?) => {
      if (response && response['message']) {
        this.cmp.pop(response['message']);
      }
    });
  }

}