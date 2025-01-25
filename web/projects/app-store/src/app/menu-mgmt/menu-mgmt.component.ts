import { Component, OnInit, ViewChild, Inject, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CmpService, JsonResult, TableEmptyMessageComponent, Util } from 'app-lib';
import { MenuCatComponent } from './menu-cat/menu-cat.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { MenuOptionComponent } from './menu-option/menu-option.component';
import { MatDialog } from '@angular/material';
import { MenuConfirmComponent } from './menu-confirm/menu-confirm.component';
import { JsonService } from 'ami';

@Component({
  selector: 'app-menu-mgmt',
  templateUrl: './menu-mgmt.component.html',
  styleUrls: ['./menu-mgmt.component.css']
})
export class MenuMgmtComponent implements OnInit {

  @ViewChild('menu', { static: false }) menu: MenuListComponent;
  @ViewChild('cat', { static: false }) cat: MenuCatComponent;
  @ViewChild('fileInput', { static: true }) fileInput;
  @ViewChild('option', { static: false }) option: MenuOptionComponent;

  // メニュー詳細フラグ
  detailFlg = false;

  // メニュー詳細データ
  menuDetailData = {};

  // カテゴリー詳細フラグ
  catFlg = false;

  // カテゴリー編集データ
  catData = {};

  // オプション詳細フラグ
  optFlg = false;

  // オプション編集データ
  optData = {};

  // 一覧スイッチ
  listSwitch = 'theme';

  constructor(
    private dialog: MatDialog,
    private json: JsonService,
    private loginDialog: MatDialog,
    private cmp: CmpService,
  ) { }

  ngOnInit() {
  }

  onRefresh() {
    if (this.listSwitch === 'M') {
      this.menu.onSearch();
    }
    if (this.listSwitch === 'C') {
      this.cat.onSearch();
    }
  }

  onAddCat() {
    this.cat.onAddCat();
  }

  onAddOption() {
    this.option.onAddOption();
  }
  onUploadMenu() {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(event) {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;

    if (Object.keys(files).length === 0) {
      return;
    }
    Object.keys(files).forEach(key => {
      let reader = new FileReader();
      reader.readAsDataURL(files[key]);
      reader.onload = (_event) => {
        const params = {};
        params['file_data'] = reader.result;
        // var fileObj = (<HTMLInputElement>document.getElementById('fileField')).files[0];
        // params['file_path'] = window.URL.createObjectURL(fileObj);
        // 查数据是否冲突
        const dialog = this.loginDialog.open(MenuConfirmComponent, {
          width: '300vh',
          height: '100vh',
          data: params
        });
        dialog.afterClosed().subscribe(result => {
          if (result === '1') {
            this.onRefresh();
          }
        });
        this.fileInput.nativeElement.value = "";
      };
    });
  }

  onEditMenu(event) {
    if (typeof event === 'boolean') {
      this.detailFlg = false;
      if (event) {
        this.json.post('s/menu_mgmt_api/get_menu_detail', {}).subscribe((response: JsonResult) => {
          if (response.data) {
            this.menuDetailData = {
              ing: response.data.ing,
              cat: response.data.menu_cat,
              options: response.data.menu_option
            };
          }
          const dialog = this.dialog.open(MenuDetailComponent, {
            width: '850px',
            height: '700px',
            data: this.menuDetailData
          })
          dialog.afterClosed().subscribe(result => {
            if (result) {
              this.onRefresh();
            }
          });
        });
      }
    } else {
      this.detailFlg = false;
      this.json.post('s/menu_mgmt_api/get_menu_detail', { menu_id: event }).subscribe((response: JsonResult) => {
        if (response.data) {
          this.menuDetailData = {
            result: response.data.result,
            ing: response.data.ing,
            cat: response.data.menu_cat,
            options: response.data.menu_option,
            site_image_host: response.data.site_image_host
          };
        }
        const dialog = this.dialog.open(MenuDetailComponent, {
          width: '850px',
          height: '750px',
          data: this.menuDetailData
        })
        dialog.afterClosed().subscribe(result => {
          if (result) {
            this.onRefresh();
          }
        });
      });
    }
  }

  // onEditCat(event) {
  //   if (typeof event === 'boolean') {
  //     this.catFlg = false;
  //     if (event) {
  //       this.json.post('s/menu_mgmt_api/get_cat_data', {}).subscribe((response: JsonResult) => {
  //         if (response.data) {
  //           this.catData = {
  //             parents: response.data.parents
  //           };
  //         }
  //         const dialog = this.dialog.open(AddCatComponent, {
  //           width: '850px',
  //           height: '580px',
  //           data: this.catData 
  //         })
  //         dialog.afterClosed().subscribe(result => {
  //           if(result){
  //             this.listSwitch = 'C';
  //             this.onRefresh();
  //           }
  //         });
  //       });
  //     }
  //   } else {
  //     this.catFlg = false;
  //     this.json.post('s/menu_mgmt_api/get_cat_data', { cat_id: event }).subscribe((response: JsonResult) => {
  //       if (response.data) {
  //         this.catData = {
  //           result: response.data.result,
  //           parents: response.data.parents
  //         };
  //       }
  //       const dialog = this.dialog.open(AddCatComponent, {
  //         width: '850px',
  //         height: '580px',
  //         data:this.catData
  //       })
  //       dialog.afterClosed().subscribe(result => {
  //         if(result){
  //           this.listSwitch = 'C';
  //           this.onRefresh();
  //         }
  //       });
  //     });
  //   }
  // }
}
