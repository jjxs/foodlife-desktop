import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ManagerService } from '../manager.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MenuTop, MenuCategory } from '../../menu/menu.interface';
import { JsonService, Util, AuthenticationService } from 'ami';
import { CmpService } from '../../cmp/cmp.service';
import { AppService } from '../../app.service';


// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'top-manage-item',
  templateUrl: './top-manage-item.component.html',
  styleUrls: ['./top-manage-item.component.css']
})
export class TopManageItemComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput;
  // 写真名
  imageName = '';
  imageName1 = '';
  imagesrc2 = null;
  imagesrc1 = null;
  site_image_host = "";
  imginfolist = [];
  imgList = [];
  imageNamelist = [];
  delimglist = [];

  item: MenuTop
  groups = []
  categorys = []

  id;
  group_id;
  category_id;
  target_type;
  image;
  name;
  option;
  newoption;
  option_list;
  flag = 0;

  target_types = [
    {
      'key': 'link',
      'value': '跳转页面'
    }, {
      'key': 'image',
      'value': '图片'
    }, {
      'key': 'dialog-image',
      'value': '図鑑'
    }
  ];

  constructor(
    private managerSrv: ManagerService,
    public dialogRef: MatDialogRef<TopManageItemComponent>,
    private jsonSrv: JsonService,
    private cmp: CmpService,
    public appService: AppService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.site_image_host = this.appService.SiteImageHost + '/';
    let item = data.item;
    this.id = data.id;
    if (item) {
      this.image = item.image;
      this.target_type = item.target_type;
      if (item.option != null) {
        this.option_list = item.option.substr(0, item.option.length - 1).split(';');
      }
      this.option = item.option;
      if (item.link) {
        let arr = item.link.split(':');
        if (arr.length < 2) return;
        this.group_id = parseInt(arr[0]);
        this.chagne_group(this.group_id);
        this.category_id = parseInt(arr[1]);
      }
    }
    for (var i in data.groups) {
      this.groups.push({
        'key': data.groups[i]['id'],
        'value': data.groups[i]['display_name']
      });
    }
  }


  ngOnInit() {

  }
  change_target_type(event) {
  }

  chagne_group(group_id) {
    this.group_id = group_id;
    this.jsonSrv.get('restaurant/menu/category/', { category_group: group_id }).subscribe((response) => {

      if (Util.isEmpty(response) || Util.isEmpty(response[0])) {
        return;
      }
      this.categorys = [];
      for (var i in response) {
        this.categorys.push({
          'key': response[i]['id'],
          'value': response[i]['display_name']
        });
      }
    })
  }

  ok(event) {
    let params = {
      'target_type': this.target_type,
      'link': this.group_id + ':' + this.category_id,
      'image': this.image,
      'name': this.name,
      'option': this.option == undefined ? '' : this.option,
      'id': this.id,
    }
    // 图片列表
    params['imgData'] = this.imginfolist;
    params['imgData'].reverse();
    params['imgName'] = this.imageNamelist;
    // 主図図片
    params['imgData1'] = this.imagesrc1;
    params['imgName1'] = this.imageName1;
    // 删除的图片
    params['dellist'] = this.delimglist;
    this.jsonSrv.post('restaurant/menu/post_menu_top/', params).subscribe((response?) => {
      if (response && response["message"]) {
        this.cmp.pop('終了しました。');
        this.imginfolist = [];
        this.imageNamelist = [];
        this.dialogRef.close();
      }
    });
  }

  // 写真選択
  onSelectPhoto(flag) {
    if (flag == '1') {
      this.flag = 1
    } else {
      this.flag = 2
    }
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
          if (this.flag == 1) {
            // 主図図片
            this.imagesrc1 = reader.result;
            this.imageName1 = files[key].name;
          } else {
            // 图片列表
            this.imginfolist.unshift(reader.result);
            this.imageNamelist.unshift(files[key].name)
          }
        } else {
          this.cmp.pop('対応しないファイル形式です。jpg、pngファイルを登録してください。');
        }
      };
    });
  }

  del(type, event) {
    this.newoption = '';
    this.cmp.confirm('图片を削除しますか？').afterClosed().subscribe(result => {
      if (result === 'yes') {
        if (type == 'new') {
          // 进入页面新添加的图片
          this.imginfolist.splice(event, 1)
          this.imageNamelist.splice(event, 1)
          
        } else {
          // 进入页面数据库中的图片
          // 把已经存入s3的图片删除
          this.delimglist.push(this.option_list[event])
          this.option_list.splice(event, 1)
          for (let index = 0; index < this.option_list.length; index++) {
            this.newoption += this.option_list[index] + ";"
          }
          this.option = this.newoption
        }
      }
    });
  }
}