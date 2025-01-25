import { Component, OnInit, Inject } from '@angular/core';
import { ManagerService } from '../manager.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MenuTop, MenuCategory } from '../../menu/menu.interface';
import { JsonService, Util, AuthenticationService } from 'ami';
import { CmpService } from '../../cmp/cmp.service';
import { MenuService } from '../../menu/menu.service';


// （TODO:　所属料理、注文可能品ない場合、該当タブ非表示にする）<br>
// （TODO: 持ち帰りから遷移可能、３モードが必要＝＞席モード、放題モード、持ち帰りモード）

@Component({
  selector: 'course-manage-abc',
  templateUrl: './course-manage-abc.component.html',
  styleUrls: ['./course-manage-abc.component.css']
})
export class CourseManageAbcComponent implements OnInit {
  menus = null;
  categorys = []
  master_group = [];
  orign_menus = [];

  current_master_group = 0;
  current_group_data = [];

  id = 0;
  course_menu_id = 0;
  menu_course_detail = []

  
  is_set = false
  currentIndex = 1;
  currentTitle = "菜单1";
  course_detail = {};

  constructor(
    private managerSrv: ManagerService,
    public dialogRef: MatDialogRef<CourseManageAbcComponent>,
    private jsonSrv: JsonService,
    private cmp: CmpService,
    private menuSrv: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getMenuList()
    this.id = data['course_id']
    this.getCourse(this.id)
    

    this.master_group = [];
    this.orign_menus = [];
    this.jsonSrv.get('master/master/?domain__in=menu_category', {}).subscribe((response?: any[]) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.master_group = response;
        this.master_group.forEach((item: any) => {
          item.index = 0;
        })
      }
    });
  }


  next() {
    this.course_detail[this.currentIndex] = this.menu_course_detail;
    this.currentIndex = this.currentIndex + 1;
    this.currentTitle = "菜单" + this.currentIndex;
    this.menu_course_detail = [];
    if ( this.course_detail[this.currentIndex] ) {
      this.menu_course_detail = this.course_detail[this.currentIndex];
    }
    this.changeMenuData(this.orign_menus);
  }

  pre() {
    this.currentIndex = this.currentIndex - 1;
    this.currentTitle = "菜单" + this.currentIndex;
    if ( this.course_detail[this.currentIndex] ) {
      this.menu_course_detail = this.course_detail[this.currentIndex];
    }
    this.changeMenuData(this.orign_menus);
  }

  getCourse(id) {
    if( !id ) return;
    this.jsonSrv.get('restaurant/menu/get_course/', {course_id: id}).subscribe((response) => {
      if (Util.isEmpty(response)) {
        return;
      }
      response['menu_course_detail'].forEach((item: any) => {
          if ( !item['group_id'] ) {
            item['group_id'] = 1;
          }
          const group_id = item['group_id']
          if ( !this.course_detail[group_id] ) {
            this.course_detail[group_id] = [];
          }
          this.course_detail[group_id].push(item);
      });
      this.course_menu_id = response['menu_id']
      this.menu_course_detail = this.course_detail[1];
      this.is_set = response['level']
    })
  }

  getMenuList() {
    this.jsonSrv.get('restaurant/menu/menu_list/', {}).subscribe((response?: any[]) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.orign_menus = response;
      }
    });
  }

  
  onCategoryChange(event) {
    this.current_master_group = event.index;
    this.loadMenuList()
  }

  loadMenuList() {
    let group_id = this.master_group[this.current_master_group].id
    this.jsonSrv.get('restaurant/menu/menucategory/', { category_group: group_id }).subscribe((response?: Array<MenuCategory>) => {
      if (!Util.isEmpty(response) && response[0]) {
        this.current_group_data = response;
        this.changeMenuData(this.orign_menus);
      }
    })
  }



  changeMenuData(orign_menus) {
    this.menus = orign_menus.filter((menu) => {
      let has = this.menu_course_detail.findIndex((detail) => {
        return detail.id === menu.id
      })
      if ( has>=0 ) {
        return false;
      }

      // tslint:disable-next-line: forin
      for(const i in this.course_detail) {
        const course_detail = this.course_detail[i];
        has = course_detail.findIndex((detail) => {
          return detail.id === menu.id;
        })
        if ( has>=0 ) {
          return false;
        }
      }

      let index = this.current_group_data.findIndex((category) => {
        return category.menu_id === menu.id;
      });
      return index >= 0;
    })
  }


  ngOnInit() {
  }


  addMenu(menu_course_detail, menu) {
    // if(this.menu_course_detail.length>=3) {
    //   return;
    // }
    menu_course_detail.push(menu);
    // this.course_detail[this.currentIndex].push(menu);
    this.changeMenuData(this.orign_menus);
  }

  removeMenu(event, menu) {
    this.menu_course_detail = this.menu_course_detail.filter((detail) => {
      return detail.id !== menu.id;
    })
    this.changeMenuData(this.orign_menus);
  }

  save(event) {
    this.next();
    let params = {
      'course_menu_id': this.course_menu_id,
      'course_detail' : this.course_detail,
      'id': this.id,
      'level': this.is_set? 1: 0
    }
    this.jsonSrv.post('restaurant/menu/save_course/', params).subscribe((response?) => {

      if (response && response["message"]) {
          this.cmp.pop(response["message"]);
          if( response['status']=='success' ) {
            this.id = response['id']
            this.dialogRef.close(1);
          }
      }
    });
  }
  

  onUp(event, menu, index) {
    this.menu_course_detail.splice(index, 1);
    this.menu_course_detail.splice(index - 1, 0, menu);
  }

}