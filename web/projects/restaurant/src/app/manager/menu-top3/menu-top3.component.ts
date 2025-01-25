import { Component, OnInit, Inject, Output, EventEmitter, Input, ViewChild, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Util, JsonService, JsonResult, CmpService } from 'app-lib';
import { MenuTop } from '../../menu/menu.interface';
import { AppService } from '../../app.service';

@Component({
  selector: 'menu-top3',
  templateUrl: './menu-top3.component.html',
  styleUrls: ['./menu-top3.component.css']
})
export class MenuTop3Component implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput;

  // 編集フォーム
  editForm: FormGroup;
  // 画像
  imagePath = '';
  image = null;
  newimage = '';
  // 写真サイズ
  imageSize = 0;
  // 写真名
  imageName = '';
  menu_top_data = {}
  site_image_host = "";

  constructor(
    private fb: FormBuilder,
    private cmp: CmpService,
    private json: JsonService,
    public appService: AppService,
    @Optional() public dialogRef: MatDialogRef<MenuTop3Component>,
  ) {
    this.editForm = this.fb.group({
      id: ['', []],
    });

    this.site_image_host = this.appService.SiteImageHost + '/';
  }

  ngOnInit() {
    this.getTopData();
  }
  getTopData() {
    this.json.post('restaurant/menutop3/get_theme_list/', {}).subscribe((response?: any[]) => {
      if (!Util.isEmpty(response)) {
        this.editForm.patchValue(response);
        this.menu_top_data = response;
      }
    });
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
        this.newimage = '';
      }
    });
  }

  onSave() {
    const params = this.editForm.value;
    params['imgData'] = this.image;
    params['imgName'] = this.imageName;

    this.json.post('restaurant/menutop3/set_menu_top3/', params).subscribe((response: JsonResult) => {
      if (response.result == true) {
        this.cmp.pop(response.message);
        if (response.result) {
          // this.dialogRef.close();
        }
      } else {
        this.cmp.pop("上传失敗");
      }
    });
  }

  onCancel() {
    this.editForm.reset();
    this.dialogRef.close();
  }

}
