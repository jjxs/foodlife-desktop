import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { ManagerService } from '../manager.service';
import { MatDialog } from '@angular/material';
import { JsonService, Util, AuthenticationService } from 'ami';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { CmpService } from '../../cmp/cmp.service';
import { LanguageItemEditComponent } from '../language-item-edit/language-item-edit.component';


// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'language-manage',
  templateUrl: './language-manage.component.html',
  styleUrls: ['./language-manage.component.css']
})
export class LanguageManageComponent implements OnInit {

  displayedColumns: string[] = ['ja', 'zh', 'en', 'button'];
  dataSource = new MatTableDataSource;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  keyword = ""
  constructor(
    private dialog: MatDialog,
    private jsonSrv: JsonService,
    private cmp: CmpService,
    private managerSrv: ManagerService
  ) {
    this.getData();
  }

  ngOnInit() {
    this.managerSrv.changeToolbar("言語管理");

    this.managerSrv.showPanel(false);

    this.dataSource.paginator = this.paginator;
  }

  add() {
    const row = {
      'ja': '',
      'zh': '',
      'en': '',
      'name': ''
    };
    this.edit(row);
      // this.dataSource.data.push(row);
  }

  edit(row) {
    const dialog = this.dialog.open(LanguageItemEditComponent, {
      width: '60%',
      height: '500px',
      data: row
    });
    dialog.afterClosed().subscribe(result => {
      // row = result;
      this.getData();
      // this.cmp.pop("処理しました。");
    });
  }

  getData() {
    this.jsonSrv.post('restaurant/master/language/', {}).subscribe((response: any) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.dataSource.data = response;
      }
    });
  }

  onDelete(row){
    this.cmp.confirm('選択された言語を削除しますか？').afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.jsonSrv.post('restaurant/master/delete_language/', row).subscribe((response) => {
          this.getData();
          this.cmp.pop("削除しました。");
        });
      }
    });
  }

  onSearch(){
    const params = {
      keyword: this.keyword
    };
    this.jsonSrv.post('restaurant/master/language/', params).subscribe((response: any) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.dataSource.data = response;
      }
    });
  }
}