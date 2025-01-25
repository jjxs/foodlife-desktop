import { Component, OnInit, Inject, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Util, JsonService, JsonResult, CmpService } from 'app-lib';
import { FormControl } from '@angular/forms';
import { AppService } from '../../../../../../restaurant/src/app/app.service';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-payment-edit',
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.css']
})
export class PaymentEditComponent implements OnInit {

  @Output() edit = new EventEmitter<any>();
  @Output() saved = new EventEmitter<any>();

  @ViewChild('fileInput', { static: false }) fileInput;

  // テーブル
  displayedColumns = ['code', 'name', 'display_name', 'display_order', 'option'];
  dataSource = new MatTableDataSource<any>([]);
  // 編集フォーム
  editForm: FormGroup;
  // ID
  currentID = null;
  // 画像
  imagePath = '';
  image = null;
  imageFull = '';
  // 写真サイズ
  imageSize = 0;
  // 写真名
  imageName = '';
  menu_top_data = {}
  site_image_host1 = "";
  edit_flag = 0

  constructor(
    private fb: FormBuilder,
    private cmp: CmpService,
    private json: JsonService,
    public dialogRef: MatDialogRef<PaymentEditComponent>,
    public appService: AppService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      code: ['', []],
      name: ['', [Validators.required]],
      display_name: ['', []],
      display_order: [0, []],
      option: ['', []]
    });
    if (Object.keys(data).length !== 0) {
      const params = this.editForm.value;
      params['id'] = data['id'];
      this.json.post('s/payment_api/get_edit_data', params).subscribe((response: JsonResult) => {
        if (response.data) {
          // 修改页面标识
          this.edit_flag = 1 
          this.currentID = data['id'];
          this.image = '';
          this.imageFull = '';
          this.imagePath = response.data['site_image_host'];
          if (!Util.isEmpty(response.data.rows[0].option) && !Util.isEmpty(response.data.rows[0].option.image)) {
            this.imageFull = this.imagePath + '/' + response.data.rows[0].option.image;
          }
          this.editForm.patchValue(response.data.rows[0]);
          this.menu_top_data = response.data.rows[0].option['img'];
        }
      });
    }
    
    this.site_image_host1 = this.appService.SiteImageHost + '/';
  }

  ngOnInit() {
  }

  // 写真選択
  onSelectPhoto() {
    this.fileInput.nativeElement.click();
  }

  // 写真読み込み
  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;

    Object.keys(files).forEach(key => {
      const reader = new FileReader();
      reader.readAsDataURL(files[key]);
      reader.onload = (event) => {
        if (
          String(reader.result).indexOf('data:image/jpeg;base64,') >= 0
          || String(reader.result).indexOf('data:image/png;base64,') >= 0
        ) {
          this.image = reader.result;
          this.imageSize = event.loaded;
          this.imageName = files[key].name;
        } else {
          this.cmp.pop('対応しないファイル形式です。jpg、pngファイルを登録してください。');
        }
      };
    });
  }

  // 写真削除
  onDeletePhoto() {
    this.cmp.confirm('写真を削除しますか？').afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.fileInput.nativeElement.value = '';
        this.image = '';
        this.imageFull = '';
      }
    });
  }

  onSave() {
    Object.values(this.editForm.controls).forEach((c: FormControl) => c.markAsTouched());
    const params = this.editForm.value;
    params['id'] = this.currentID;
    params['group_id'] = 15;
    params['imgData'] = this.image;
    params['size'] = this.imageSize;
    params['imgName'] = this.imageName;
    params['edit_flag'] = this.edit_flag;
    if ( this.editForm.valid ) {
      this.json.post('s/payment_api/set_ing_data', params).subscribe((response: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          if (response.result) {
            this.currentID = response.data;
            //this.edit.emit(true);
            this.dialogRef.close(true);
          }
        }
      });
    }
  }

  onCancel() {
    this.editForm.reset();
    this.currentID = null;
    //this.edit.emit(false);
    this.dialogRef.close(false);
  }

}
