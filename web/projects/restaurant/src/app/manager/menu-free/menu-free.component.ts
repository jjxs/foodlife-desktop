import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ManagerService } from '../manager.service';
import { MatDialog } from '@angular/material';
import { MenuFreeEditComponent } from '../../manager/menu-free-edit/menu-free-edit.component';
import { JsonService, Util, AuthenticationService } from 'ami';
import { MatSort, MatTableDataSource } from '@angular/material';
import { CmpService } from 'app-lib';

// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'menu-free',
  templateUrl: './menu-free.component.html',
  styleUrls: ['./menu-free.component.css']
})
export class MenuFreeComponent implements OnInit {



  // テーブル
  displayedColumns = ['group_name', 'menu_name',  'menu_price', 'button'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private dialog: MatDialog,
    private jsonSrv: JsonService,
    private cmp: CmpService,
    private managerSrv: ManagerService
  ) {
    this.getList();
  }

  getList() {
    const params = {};
    this.jsonSrv.post('restaurant/menu/free/', params).subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }

  ngOnInit() {
    this.managerSrv.changeToolbar('飲み放題管理');

    this.managerSrv.showPanel(false);

  }

  btnClick(item) {
    this.openDialog(item);
  }

  add() {
    this.openDialog();
  }

  onDelete(item) {
    if (item) {
      const name = item.menu_name;
      this.cmp.confirm(`飲み放題メニュー「${name}」削除しますか？`).afterClosed().subscribe(result => {
        if (result === 'yes') {
          const params = {
            id: item['id']
          };
          this.jsonSrv.post('restaurant/menu/free_del/', params).subscribe((response: any) => {
            this.getList();
          });
        }
      });
    }
  }

  openDialog(item = null) {
    let menu_free_id = 0;
    let free_type_id = 0;
    let menu_id = 0;
    if (item) {
      menu_free_id = item['id'];
      free_type_id = item['free_type_id'];
      menu_id = item['menu_id'];
    }
    const dialog = this.dialog.open(MenuFreeEditComponent, {
      width: '90%',
      height: '600px',
      data: {
        'menu_free_id': menu_free_id,
        'free_type_id': free_type_id,
        'menu_id': menu_id
      }
    });
    dialog.afterClosed().subscribe(result => {
      this.getList();
    });
  }

}