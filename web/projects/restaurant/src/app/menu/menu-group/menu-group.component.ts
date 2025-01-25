import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CmpService } from '../../cmp/cmp.service';
import { JsonService, Util, AuthenticationService } from 'ami';
import { MenuService } from '../menu.service';
import { MasterGroup, GroupChange } from '../menu.interface';
import { HomeComponent } from '../../home/home.component';
// import { MenuComponent } from '../menu.component';

@Component({
  selector: 'restaurant-menu-group',
  templateUrl: './menu-group.component.html',
  styleUrls: ['./menu-group.component.css']
})
export class MenuGroupComponent implements OnInit {
  public toolbardisplay = "";
  groups = [];
  groupChanged$;

  constructor(
    private cmp: CmpService,
    public authSrv: AuthenticationService,
    private jsonSrv: JsonService,
    public homeComponent: HomeComponent,
    // private menuComponent: MenuComponent,
    private menuSrv: MenuService) {
      
      //　ツールバー文字
      this.toolbardisplay = homeComponent.toolbardisplay;

      this.groupChanged$ = this.menuSrv.groupChanged$.subscribe((groupChange: GroupChange) => {
        let group = groupChange.masterGroup
        this.groups.forEach((element: MasterGroup) => {
          element.selected = (element.id === group.id);
        });
      });
  
    }

  ngOnInit() {

    this.jsonSrv.get('master/master/?domain__in=menu_category', {}).subscribe((response?: any[]) => {
      if (!Util.isEmpty(response) && response[0]) {

        const hour = new Date().getHours();
        //console.log(hour, response);
        response.forEach((group: any) => {
          if (group.option && !Util.isEmpty(group.option.display) && !group.option.display) {
            return true;
          }

          if (group.option) {
            if ((!Util.isEmpty(group.option.start) && hour < group.option.start)
              || (!Util.isEmpty(group.option.end) && hour > group.option.end)) {
              return true;
            }
          }

          group.selected = false;
          this.groups.push(group);
        });
        this.groups[0].selected = true;
        // event　を発火する
        this.changeGroup(this.groups[0])
      }
    });
  }

  onSelect(group: MasterGroup) {
    
    this.groups.forEach((element: MasterGroup) => {
      element.selected = (element === group);
    });

    this.changeGroup(group)
  }

  changeGroup(group: MasterGroup) {
    // event　を発火する
    this.menuSrv.changeGroup({
      masterGroup: group,
      categoryId: -1.
    });
  }

  
  logout() {
    const dialog = this.cmp.confirm('ログアウトしますか？');
    dialog.afterClosed().subscribe(result => {
      if (result === "yes") {
        this.authSrv.logout();
        this.authSrv.init();
      }
    });
  }

}
