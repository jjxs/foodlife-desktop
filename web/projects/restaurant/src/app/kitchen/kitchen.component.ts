import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { KitchenSettingComponent } from './kitchen-setting/kitchen-setting.component';
import { Util, JsonResult } from 'ami';
import { KitchenService } from './kitchen.service';
import { TaskData, ITaskData, StatusCode, GoToNextResult } from './kitchen.interface';
import { JsonService } from 'ami';
import { trigger, state, transition, style, animate, keyframes } from '@angular/animations';
import { CmpService } from '../cmp/cmp.service';
import { HomeService } from '../home/home.service';
import { ThemeService } from '../cmp/ami-theme-select/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css'],
  animations: [
    trigger('waitInOut', [
      transition('void => 0', [ // 新規追加の場合
        animate(400, keyframes([
          style({ opacity: 0, transform: 'translateY(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 })
        ]))
      ]),
      transition('void => 300', [
        animate(400, keyframes([
          style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ]),
      transition('100 => void', [
        animate(400, keyframes([
          style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(100%)', offset: 1.0 })
        ]))
      ]),
      transition('-1 => void', [
        animate(400, keyframes([
          style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-100%)', offset: 1.0 })
        ]))
      ])
    ]),
    trigger('doneInOut', [
      state('300', style({ transform: 'translateX(0)' })),
      transition('void => 100', [
        animate(400, keyframes([
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ]),
      transition('void => 999', [
        animate(400, keyframes([
          style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ]),
      transition('300 => void', [
        animate(200, keyframes([
          style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-100%)', offset: 1.0 })
        ]))
      ]),
      transition('999 => void', [
        animate(200, keyframes([
          style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(100%)', offset: 1.0 })
        ]))
      ]),
      transition('-1 => void', [
        animate(400, keyframes([
          style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-100%)', offset: 1.0 })
        ]))
      ])
    ]),
    trigger('overInOut', [
      state('999', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        animate(400, keyframes([
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ]),
      transition('* => void', [
        animate(200, keyframes([
          style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-100%)', offset: 1.0 })
        ]))
      ])
    ]),
    trigger('overPanelInOut', [
      transition('void => *', [
        animate(400, keyframes([
          style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ]),
      transition('* => void', [
        animate(200, keyframes([
          style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(100%)', offset: 1.0 })
        ]))
      ])
    ]),
    trigger('cancelPanelInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        animate(400, keyframes([
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ]),
      transition('* => void', [
        animate(200, keyframes([
          style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-100%)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class KitchenComponent implements OnInit {


  onlyToday = true;

  deleteModel = false;
  isShowOverPanel = false;
  isShowDoingPanel = false;
  isShowDonePanel = false;
  isShowCancelPanel = false;

  order_data: Array<TaskData> = []

  // { CODE1: [] , CODE2: [] }
  task_data = {
    '100': [],
    '200': [],
    '300': [],
    '999': [],
    '-1': []
  };

  task_detail_ids = {};
  course_list = {};
  menu_bind_list = {};


  order$;
  orderDeleted$;
  orderChanged$;



  @ViewChild('audiDiv', { static: false }) divAudio: ElementRef;
  // 監視するリスト
  get WatchList(): Array<number> {
    const item = localStorage.getItem("__kitchen_watch_list__");
    if (Util.isEmpty(item)) {
      return [];
    }
    return Util.decode(item);
  }
  set WatchList(list: Array<number>) {
    localStorage.setItem("__kitchen_watch_list__", Util.encode(list));
  }

  constructor(
    private dialog: MatDialog,
    private jsonSvr: JsonService,
    private homeSvr: HomeService,
    public svr: KitchenService,
    private themeSvr: ThemeService,
    private cmp: CmpService,
    private router: Router,
  ) {
    // 注文情報取得した場合(Webscoketから)
    this.order$ = this.svr.order$.subscribe((response: Array<ITaskData>) => {
      if (!Util.isEmpty(response) && !Util.isEmptyArray(response)) {
        let code = 0;
        const menu_no_list = [];
        response.forEach((data) => {
          const task = new TaskData(data);
          code = task.status_code;
          menu_no_list.push(task.menu_no);
          this.appendTask(task, false);
        });
        this.play(code, menu_no_list);
      }
      // this.divAudio.nativeElement.click();
    });

    // 注文削除する際
    this.orderDeleted$ = this.svr.orderDeleted$.subscribe((details: Array<number>) => {

      details.forEach((detail_id: number) => {

        if (Util.isEmpty(this.task_detail_ids[detail_id])) {
          return true;
        }

        // 現在リストから削除する。
        const current_code = this.task_detail_ids[detail_id].toString();

        const current_index = this.task_data[current_code].findIndex((data: TaskData) => {
          return data.detail_id === detail_id;
        });

        if (current_index >= 0) {
          this.task_data[current_code].splice(current_index, 1);
        } else {
          this.refreshTask();
        }

        delete this.task_detail_ids[detail_id];
      });
    });

    this.orderChanged$ = this.svr.orderChanged$.subscribe(() => {
      this.refreshTask();
    });
  }

  ngOnInit() {

    this.jsonSvr.post('s/setsubi_api/get_mac_data', {}).subscribe((response: JsonResult) => {
      if (response['data'] == '1') {
        this.themeSvr.change('indigo-pink');
        this.init();
        this.homeSvr.showHeader(false);
      } else {
        this.router.navigateByUrl('/store/setsubi-error');
        return;
      }
    });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.order$.unsubscribe();
    this.orderDeleted$.unsubscribe();
    this.orderChanged$.unsubscribe();
  }

  init() {

    this.setPlayItem();
    if (Util.isEmptyArray(this.WatchList)) {
      this.openKitchenSetting('');
    }
    // websocket監視起動
    this.svr.startWebsocket(this.WatchList);

    this.refresh();


  }

  refresh() {
    this.getMenuBindList();
    this.getCourseList();
  }

  refreshTask() {
    this.task_data = {
      '100': [],
      '200': [],
      '300': [],
      '999': [],
      '-1': []
    };

    this.task_detail_ids = {};

    // this.detail_id_list = [];
    const params = {};
    params['today'] = this.onlyToday;
    if (!Util.isEmptyArray(this.WatchList)) {
      params['list'] = this.WatchList;
    }
    // 最新データ取得
    this.jsonSvr.post('restaurant/kitchen/get_task/', params).subscribe((response: Array<ITaskData>) => {

      if (!Util.isEmpty(response) && !Util.isEmptyArray(response)) {
        response.forEach((task) => {
          this.appendTask(new TaskData(task), true);
        });
      }
    });
  }

  audio100: any;
  audio300: any;

  setPlayItem() {
    this.audio100 = new Audio('/assets/audio/kitchen.mp3');
    this.audio100.load();


    this.audio300 = new Audio('/assets/audio/kitchen100.mp3')
    this.audio300.load();
  }

  // clickPlayAuto(code?) {
  //   if (code === 200)
  //     this.play();
  // }

  play(code?, menu_no_list?) {
    if (code === 100 && this.isShowDoingPanel) {
      if (!start_mp3(menu_no_list)) {
        this.audio100.play();
      }
    }

    // $window.start_kitchen_mp3();

    if (code === 300 && this.isShowDonePanel) {
      this.audio300.play();
    }
  }

  // stop() {
  //   if (Util.isEmpty(this.audio))
  //     return;

  //   this.audio.pause();
  //   this.audio.currentTime = 0;
  // }

  // 取消する場合
  removeTask(task: TaskData) {

  }


  onNext(task: TaskData, code) {

    if (this.deleteModel) {
      return;
    }

    // まとめ処理しないため、コメントアウト
    // if (task.sub_data.length > 0) {
    //   const index = this.task_data[task.status_code.toString()].indexOf(task);
    //   if (index >= 0) {
    //     this.task_data[task.status_code.toString()].splice(index, 1);
    //   }
    //   task.sub_data.forEach((sub: TaskData) => {
    //     this.send(sub, code);
    //   });

    //   return;
    // }
    this.send(task, code);

  }

  onRestart(task: TaskData) {
    this.send(task, 100);
  }

  onCancel(task: TaskData) {
    this.send(task, -1);
  }

  // サーバ側送信、かつ更新
  send(task: TaskData, code) {

    const params = {
      detail_id: task.detail_id,
      detail_status_id: task.detail_status_id,
      current_status_code: task.status_code,
      next_status_code: code,
      menu_id: task.menu_id,
      task: task
    };

    this.jsonSvr.post('restaurant/kitchen/goto_next/', params).subscribe((response: JsonResult) => {

      if (Util.isEmpty(response)) {
        return;
      }

      if (!Util.isEmpty(response.message)) {
        this.cmp.pop(response['message'])
      }
    });
  }

  onDelete(task: TaskData) {
    this.jsonSvr.post('restaurant/kitchen/remove_task/', {
      detail_id: task.detail_id,
      order_id: task.order_id
    }).subscribe((response: JsonResult) => {

      if (Util.isEmpty(response)) {
        return;
      }

      if (!Util.isEmpty(response.message)) {
        this.cmp.pop(response['message']);
      }
    });
  }

  // 全監視デバイス同期のため、コメントアウト
  // changeTask(task: TaskData, next: GoToNextResult) {
  //   // console.log('changeTask', task, next)

  //   //
  //   const index = this.task_data[task.status_code.toString()].indexOf(task);
  //   if (index >= 0) {
  //     this.task_data[task.status_code.toString()].splice(index, 1);
  //   }

  //   // this.detail_id_list.splice(this.detail_id_list.indexOf(task.detail_id), 1)
  //   task.detail_status_id = next.detail_status_id;
  //   task.status_code = next.status_code;
  //   task.status_username = next.status_username;

  //   this.appendTask(task, false);
  // }

  openKitchenSetting(event) {

    const dialogMenuFree = this.dialog.open(KitchenSettingComponent, {
      width: '80%',
      height: '65vh',
      disableClose: true,
      data: { selections: this.WatchList }
    });
    dialogMenuFree.afterClosed().subscribe((result) => {
      // console.log("Util.encode(result) !== Util.encode(this.WatchList)", Util.encode(result) !== Util.encode(this.WatchList))
      if (!Util.isEmpty(result) && Util.encode(result) !== Util.encode(this.WatchList)) {
        this.WatchList = result;
        this.init();
      }
      if (Util.isEmptyArray(result)) {
        // 設定全部外した場合、監視を中止する
        this.svr.closeWebsocket();
      }
    });
  }

  // サブタスク完了
  onSubDel(subTask: TaskData, onwerTask: TaskData) {

    const tasks: Array<TaskData> = this.task_data[subTask.status_code.toString()];
    const exitsTask = tasks.find((data) => {
      // 同じ料理ID、且つ所属タスクに関係ないタスクを探す
      return subTask.menu_id === data.menu_id && data.detail_id !== onwerTask.detail_id;
    });

    if (Util.isEmpty(exitsTask)) {

      // 注文時間で挿入位置を探す
      const index = tasks.findIndex((data) => {
        return subTask.order_time < data.order_time;
      });
      if (index < 0) {
        // 最後に追加
        this.task_data[subTask.status_code.toString()].push(subTask);
      } else {
        this.task_data[subTask.status_code.toString()].splice(index, 0, subTask);
      }


    } else {
      // 既存に存在する場合、まとめて管理する
      exitsTask.addsub(subTask);
    }
  }


  // タスク追加
  appendTask(task: TaskData, isNew: boolean) {
    if (Util.isEmpty(task)) {
      return;
    }
    task = this.checkSpec(task);

    // if (this.detail_id_list.indexOf(task.detail_id) >= 0) {
    //   // 該当明細既に追加されている場合、処理しない
    //   return;
    // }

    const status = task.status_code.toString();

    // 重複チェック
    if (!Util.isEmpty(this.task_detail_ids[task.detail_id])) {
      // 現在リストから削除する。
      const current_code = this.task_detail_ids[task.detail_id].toString();
      const current_index = this.task_data[current_code].findIndex((data: TaskData) => {
        if (data.sub_data.length === 0) {
          return data.detail_id === task.detail_id;
        }

        // サブある場合
        return data.sub_details.indexOf(task.detail_id) >= 0;
      });

      if (current_index >= 0) {
        // 没有子任务，并且子任务只剩一个的时候
        if (this.task_data[current_code][current_index].sub_data.length <= 1) {
          this.task_data[current_code].splice(current_index, 1);
          if (current_code == task.status_code.toString()) {
            this.task_data[current_code].splice(current_index, 0, task)
            return;
          }
        } else {
          this.task_data[current_code][current_index].removesub(task.detail_id);
        }
      }
    }
    this.task_detail_ids[task.detail_id] = status;

    // 処理待ち以外の場合,リストのさいしょについかする。
    if (status !== '100') {
      this.task_data[status].splice(0, 0, task);
      return;
    }

    // 以下は、処理待ちの場合
    const tasks: Array<TaskData> = this.task_data[status];

    if (this.course_list[task.menu_id] == undefined) {
      const exitsTask = tasks.find((data) => {
        // tslint:disable-next-line: no-console
        return (task.menu_id === data.menu_id && task.menu_display_name === data.menu_display_name);
      });

      if (!Util.isEmpty(exitsTask)) {
        // 既存に存在する場合、まとめて管理する
        exitsTask.addsub(task);
        return;
      }
    } else {
      isNew = true;
    }

    let index = -1;
    if (this.menu_bind_list[task.menu_id]) {
      this.menu_bind_list[task.menu_id].forEach((id: any) => {
        if (index < 0) {
          index = tasks.findIndex((data) => {
            // tslint:disable-next-line: no-console
            console.info(id, data.menu_id);
            return id === data.menu_id;
          });
          if (index >= 0) {
            index = index + 1;
            isNew = false;
          }
        }
      });
      // tslint:disable-next-line: no-console
      console.info(index);
    }
    if (isNew) {
      // 新規の場合、順序あるので、そのまま後ろに追加
      this.task_data[status].push(task);
      return;
    }

    // 注文時間で挿入位置を探す
    if (index < 0) {
      index = tasks.findIndex((data) => task.order_time < data.order_time);
    }
    if (index < 0) {
      // 最後に追加
      this.task_data[status].push(task);
    } else {
      this.task_data[status].splice(index, 0, task);
    }
  }

  checkSpec(task: TaskData) {
    task.menu_display_name = task.menu_name;
    for (const i in task.menu_option) {
      if (task.menu_option[i]['select_name'] !== undefined
        && task.menu_option[i]['select_name'] !== false) {
        task.menu_display_name = task.menu_display_name + '-' + task.menu_option[i]['select_name'];
      }
    }
    return task;
  }


  onRemoveTask(task: TaskData, index: number) {
    // サブタスクすべてなくした場合、該当タスクも削除する
    this.task_data[task.status_code.toString()].splice(index, 1);
  }

  getCourseList() {
    this.jsonSvr.post('restaurant/menu/course_list/', { 'course_detail_menu': 1 }).subscribe((response: any) => {
      if (Util.isEmpty(response) || Util.isEmpty(response[0])) {
        this.refreshTask();
        return;
      }
      response.forEach((course: any) => {
        const menu_id = course['id'];
        this.course_list[menu_id] = course;
      });
      this.refreshTask();
    });
  }

  getMenuBindList() {
    this.jsonSvr.post('restaurant/menu/bind_list/', {}).subscribe((response: any) => {
      if (Util.isEmpty(response) || Util.isEmpty(response[0])) {
        this.refreshTask();
        return;
      }
      response.forEach((item: any) => {
        const list = [];
        item['menu'].forEach((menu: any) => {
          list.push(menu['menu_id']);
        });
        list.forEach((id: any) => {
          this.menu_bind_list[id] = list;
        });
      });
    });
  }
}

declare module amiJs {
  export function start_kitchen_mp3(menu_no_list): any;
}
function start_mp3(menu_no_list) {
  if (typeof amiJs === 'undefined') {
    return false;
  }
  amiJs.start_kitchen_mp3(JSON.stringify(menu_no_list));
  return true;
}
