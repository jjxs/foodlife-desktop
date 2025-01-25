import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Util, JsonService, JsonResult, CmpService, AppSettings } from 'app-lib';

@Component({
  selector: 'app-menu-child-edit',
  templateUrl: './menu-child-edit.component.html',
  styleUrls: ['./menu-child-edit.component.css']
})
export class MenuEditChildComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput;

  @Output() edit = new EventEmitter<any>();
  @Output() saved = new EventEmitter<any>();

  // 編集フォーム
  editForm: FormGroup;
  // カテゴリー
  categories = [];
  // 通貨
  currencys = [];
  // 材料ID
  currentID = null;

  // thmee list
  theme_list = []

  flag = true;
  newflag = 0;
  newflag1 = 0;

  photo = [];
  photo_args = [];
  change_photo_index = 0;

  // 　inputのclick事件
  clear() {
    if (this.flag) {
      //  修正じゃない場合
      if (this.newflag != 1) {
        (<HTMLInputElement>document.getElementById('content')).value = '';
        this.flag = false;
      }
    }
  }

  constructor(
    private fb: FormBuilder,
    private cmp: CmpService,
    private json: JsonService,
    public dialogRef: MatDialogRef<MenuEditChildComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      code: ['', Validators.required],
      display_name: ['', Validators.required],
      theme_id: ['', Validators.required],
      menu_count: [''],
      display_order: ['', Validators.required],
    });
    let params = {};
    let parent_id = data['id'];
    this.theme_list = data['theme_list'];
    params['parent_id'] = parent_id;
    this.json.post('s/menu_mgmt_api/select_child_data', params).subscribe((response: JsonResult) => {
      if (response.message == 'Success') {
        if (response.result) {
          this.currentID = parent_id;
          data = response.data[0];
          this.editForm.patchValue(data);
          if (data['option_photo_args']) {
            // tslint:disable-next-line: forin
            for (const i in data['option_photo_args']) {
              this.photo.push(data['site_image_host'] +　'/' + data['option_photo_args'][i] + '?' + Math.random());
            }
          }
          // this.dialogRef.close('1');
        }
      }
    });
  }

  ngOnInit() {
  }


  onSave() {
    const params = this.editForm.value;
    params['id'] = this.currentID;
    params['flag'] = 'child';
    params['menu_count'] = AppSettings.getThemeMenuCount(params['theme_id']);
    if (this.photo_args.length>0) {
      params['photo_args'] = this.photo_args;
    }
    if (this.editForm.valid) {
      this.json.post('s/menu_mgmt_api/update_data', params).subscribe((response: JsonResult) => {
        if (response) {
          this.cmp.pop(response.message);
          if (response.result) {
            this.dialogRef.close(true);
          }
        }
      });
    }
  }

  onCancel() {
    this.editForm.reset();
    this.currentID = null;
    // this.edit.emit(false);
    this.dialogRef.close(false);
  }


  selectTheme(event) {
    let photo_args = 0;
    // tslint:disable-next-line: forin
    for (const i in this.theme_list) {
      const item = this.theme_list[i];
      if (item['id']==event.value) {
        if (item['photo_args']) {
          photo_args = item['photo_args'];
          break;
        }
      }
    }
    this.photo = [];
    this.photo_args = [];
    if (photo_args) {
      for( let i=0; i<photo_args; i++ ) {
        this.photo.push('');
      }
    }
  }
  
  // 写真選択
  onSelectPhoto(index) {
    this.change_photo_index = index;
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
          this.photo[this.change_photo_index] = reader.result;
          this.photo_args[this.change_photo_index] = {
            'imgData' : reader.result,
            'menuImageSize' : event.loaded,
            'menuImageName' : files[key].name

          }
        } else {
          this.cmp.pop('対応しないファイル形式です。jpg、pngファイルを登録してください。');
        }
      };
    });
  }

  // 写真削除
  onDeletePhoto(index) {
    this.cmp.confirm('写真を削除しますか？').afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.photo_args = [];
        this.photo = [];
      }
    });
  }

}
