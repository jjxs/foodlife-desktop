import { Component, OnInit, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { TableEmptyMessageComponent, JsonResult, CmpService, AppSettings } from 'app-lib';
import { MatSort, MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JsonService } from 'ami';

@Component({
  selector: 'app-menu-confirm',
  templateUrl: './menu-confirm.component.html',
  styleUrls: ['./menu-confirm.component.css']
})
export class MenuConfirmComponent implements OnInit {


  theme_list = AppSettings.getThemeList();
  dataSource = new MatTableDataSource<any>([]);
  // 判断是否由冲突数据
  errorFlag = 0;
  exceldata;
  constructor(
    private fb: FormBuilder,
    private cmp: CmpService,
    private json: JsonService,
    public dialogRef: MatDialogRef<MenuConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (Object.keys(data).length !== 0) {
      if (data && Object.keys(data).length !== 0) {
        this.exceldata = data;
        this.dataSource.data = [];
        this.json.post('s/menu_upload_api/menu_confirm', data).subscribe((response: JsonResult) => {
          if (response) {
            this.dataSource.data = response.data;
            response.data.forEach(element => {
              if (element.error_no === '1' || element.error_name === '1') {
                this.errorFlag = 1;
              }
            });
          }
        });
      }
    }
  }

  ngOnInit() {
  }
  no(event) {
    this.dialogRef.close();
  }
  ok(event) {
    if (this.errorFlag === 1) {
      this.cmp.confirm('問題のあるデータは処理されません，よろしいですか！').afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.do_save();
        }
      });
    } else {
      this.do_save();
    }
  }

  do_save() {
    // 存数据
    this.json.post('s/menu_upload_api/menu_upload', this.dataSource.data).subscribe((response: JsonResult) => {
      if (response.result !== undefined) {
        this.cmp.pop(response.message);
        this.dialogRef.close("1");
      } else {
        this.cmp.pop('アップロードできませんでした');
      }
    });
  }
}
