import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ManagerService } from '../manager.service';
import { MatDialog } from '@angular/material';
import { JsonService, Util, AuthenticationService } from 'ami';
import { CmpService } from '../../cmp/cmp.service';
import { MenuBindEditComponent } from '../menu-bind-edit/menu-bind-edit.component';
import { MatSort, MatTableDataSource } from '@angular/material';

// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'menu-bind',
  templateUrl: './menu-bind.component.html',
  styleUrls: ['./menu-bind.component.css']
})
export class MenuBindComponent implements OnInit {

  // テーブル
  displayedColumns = ['name', 'button'];
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
    this.jsonSrv.get('restaurant/menu/bind_list/', {  }).subscribe((response?: any) => {
        this.dataSource = response;
    });
  }

  ngOnInit() {
    this.managerSrv.changeToolbar('メユー显示');
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
      this.cmp.confirm(`削除しますか？`).afterClosed().subscribe(result => {
        if (result === 'yes') {
          const params = {
            bind_id: item['bind_id']
          };
          this.jsonSrv.post('restaurant/menu/bind_del/', params).subscribe((response: any) => {
            this.getList();
          });
        }
      });
    }
  }

  openDialog(item=null){
    const dialog = this.dialog.open(MenuBindEditComponent, {
      width: '90%',
      height: '600px',
      data: {
        'item': item
      }
    });
    dialog.afterClosed().subscribe(result => {
      this.getList();
    });
  }
}