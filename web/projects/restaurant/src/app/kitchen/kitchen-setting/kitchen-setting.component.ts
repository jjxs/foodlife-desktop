import { Component, OnInit, Inject } from '@angular/core';
import { Util, JsonResult, JsonService } from 'ami';
import { CmpService } from '../../cmp/cmp.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../environments/environment';
import { MasterGroup, Master } from '../../menu/menu.interface';

@Component({
  selector: 'restaurant-kitchen-setting',
  templateUrl: './kitchen-setting.component.html',
  styleUrls: ['./kitchen-setting.component.css']
})
export class KitchenSettingComponent implements OnInit {

  cols = 1;
  masters: Array<Master> = [];

  constructor(
    private jsonSrv: JsonService,
    private cmp: CmpService,
    private dialogRef: MatDialogRef<KitchenSettingComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.jsonSrv.get('master/master/', { name: environment.standard_category_for_kichen }).subscribe((mastergroup: Array<MasterGroup>) => {
      if (mastergroup && mastergroup[0]) {
        const group = mastergroup[0];
        //console.log("### KitchenSettingComponent.ngOnInit", mastergroup);
        // console.log(this.data.selections)
        const count = group.master_data.length;
        for (let i = 2; i <= 10; i++) {
          if (i * i > count) {
            this.cols = i;
            break;
          }
        }

        var selections = this.data.selections || [];
        group.master_data.forEach(master => {
          if (selections.indexOf(master.id) >= 0) {
            master["checked"] = true;
          } else {
            master["checked"] = false;
          }

        });
        this.masters = group.master_data;

      }
    });
  }

  onClick(event, master) {
    event.stopPropagation();
    master["checked"] = !master["checked"]
  }

  ok() {
    let result = []
    this.masters.forEach((master) => {
      if (master["checked"] && master["checked"] === true) {
        result.push(master.id);
      }
    });
    if ( Util.isEmptyArray(result) ) {
      this.cmp.pop('設定エラー、種類を選択ください。');
    } else {
      this.dialogRef.close(result);
    }

  }

  ng() {
    this.dialogRef.close(this.data.selections);
  }

  clear() {
    this.masters.forEach((master) => {
      master["checked"] = false;
    });
  }
}
