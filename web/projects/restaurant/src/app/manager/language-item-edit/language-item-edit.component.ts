import { Component, OnInit, Inject } from '@angular/core';
import { ManagerService } from '../manager.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MenuTop, MenuCategory } from '../../menu/menu.interface';
import { JsonService, Util, AuthenticationService } from 'ami';
import { CmpService } from '../../cmp/cmp.service';


// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'language-item-edit',
  templateUrl: './language-item-edit.component.html',
  styleUrls: ['./language-item-edit.component.css']
})
export class LanguageItemEditComponent implements OnInit {
  constructor(
    private managerSrv: ManagerService,
    public dialogRef: MatDialogRef<LanguageItemEditComponent>,
    private jsonSrv: JsonService,
    private cmp: CmpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {

  }

  ok(event) {
    this.jsonSrv.post('restaurant/master/update_language/', this.data).subscribe((response) => {
      if (!Util.isEmpty(response) && !Util.isEmpty(response['data'])) {
        this.dialogRef.close( response['data'] );
        this.cmp.pop("処理しました。");
      } else {
      }
    });
  }
}