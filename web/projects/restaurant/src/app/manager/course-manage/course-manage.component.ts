import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ManagerService } from '../manager.service';
import { MatDialog } from '@angular/material';
import { CourseManageEditComponent } from '../../manager/course-manage-edit/course-manage-edit.component';
import { CourseManageAbcComponent } from '../../manager/course-manage-abc/course-manage-abc.component';
import { JsonService, Util, AuthenticationService } from 'ami';
import { MatSort, MatTableDataSource } from '@angular/material';
import { CmpService } from 'app-lib';

// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'course-manage',
  templateUrl: './course-manage.component.html',
  styleUrls: ['./course-manage.component.css']
})
export class CourseManageComponent implements OnInit {

  site_image_host = '';

  // テーブル
  displayedColumns = ['name',  'price', 'button'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private dialog: MatDialog,
    private cmp: CmpService,
    private jsonSrv: JsonService,
    private managerSrv: ManagerService
  ) {
    this.getList();
  }

  getList() {
    this.site_image_host = Util.getImageHost();
    const params = {};
    this.jsonSrv.post('restaurant/menu/course_list/', params).subscribe((response: any) => {
      this.dataSource = response;
    });
  }

  ngOnInit() {
    this.managerSrv.changeToolbar('コース管理');

    this.managerSrv.showPanel(false);

  }

  btnClick(item) {
    const dialog = this.dialog.open(CourseManageAbcComponent, {
      width: '850px',
      height: '100vh',
      data: {
        'course_id': item['course_id']
      }
    })
    dialog.afterClosed().subscribe(result => {
      this.getList();
    });
  }

  add() {
    this.btnClick({'course_id':0});
  }

  onDelete(item) {
    if (item) {
      const name = item.name;
      this.cmp.confirm(`コース メニュー「${name}」削除しますか？`).afterClosed().subscribe(result => {
        if (result === 'yes') {
          const params = {
            course_id: item['course_id']
          };
          this.jsonSrv.post('restaurant/menu/del_course/', params).subscribe((response: any) => {
            this.getList();
          });
        }
      });
    }
  }

}