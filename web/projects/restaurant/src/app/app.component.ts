import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { AmiService, AuthenticationService, Util, InitResult, JsonResult, JsonService } from 'ami';
import { environment } from '../environments/environment';
import { AppService } from './app.service';
import { CmpService } from './cmp/cmp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  usable = true;
  error_flag = 1;
  client_version = environment.version;

  get IsFullScreen(): boolean {
    const model = localStorage.getItem('__full_model__');
    if (Util.isEmpty(model)) {
      return true;
    }
    return model === 'true';
  }
  constructor(
    public authSrv: AuthenticationService,
    private cmp: CmpService,
    private router: Router,
    private jsonSrv: JsonService,
    private activatedRoute: ActivatedRoute,
    public app: AppService
  ) {

    this.authSrv.initFailed$.subscribe((result: InitResult) => {
      if (this.error_flag == 1) {
        this.checkUrl();
        // // 自動ログイン失敗した場合、ゲストでログインする
        //　this.authSrv.authenticate(environment.guest_login_info);
        this.setDefatulMenu(result);
      }
    });

    this.authSrv.initSuccessed$.subscribe((result: InitResult) => {
      if (this.error_flag == 1) {
        this.checkUrl();
        this.setDefatulMenu(result);
      }
    });

    this.app.version$.subscribe((result: boolean) => {
      // this.usable = result;
    });

    // window.addEventListener('focus', (event) => {
    //   var isFullScreen = document.fullscreenElement || document['mozFullScreenElement'] || document.webkitFullscreenElement;// 判断是否全屏
    //   if (!isFullScreen) {
    //     this.launchFullScreen(document.documentElement); // 整个页面全屏
    //     // launchFullScreen(document.getElementById('btn')); // 某个元素全屏
    //   }
    // });
  }

  ngOnInit() {

    // this.cmp.pop(this.app.get_mac(), 15000)
    const MAC_ID = this.app.get_mac()
    let params = {};
    if (MAC_ID == '') {
      params['MAC_ID'] = ''
      // this.cmp.pop('MAC異常');
      // return;
    } else {
      params['MAC_ID'] = MAC_ID
    }
    // MAC
    this.jsonSrv.post('s/setsubi_api/set_setsubi_data', params).subscribe((response: JsonResult) => {
      if (response.result == true || MAC_ID=='' ) {
        // appサービス初期化
        this.app.init();
        this.setAutoFullScreen();
        // 既存のログイン状況
        this.authSrv.init();
        this.checkUrl();
      } else {
        this.error_flag = 0
        this.cmp.pop(response.message, 10000);
        this.authSrv.showMenu = false;
        this.router.navigate(['/store/setsubi-error', {mac_id: MAC_ID}]);
        return;
      }
    });

  }

  refresh() {
    location.reload(true);
  }

  checkUrl() {
    if (this.authSrv.isRole('chart')) {
      this.router.navigate(['/charts']);
      return;
    }
  }

  setAutoFullScreen() {
    return false;
    if (!this.IsFullScreen) {
      return;
    }

    if (this.authSrv.IsDebug) {
      return;
    }

    window.addEventListener('click', (event) => {

      if (!this.IsFullScreen) {
        return;
      }

      if (this.authSrv.IsDebug) {
        return;
      }

      const isFullScreen = document['fullscreenElement'] || document['mozFullScreenElement'] || document['webkitFullscreenElement'];
      // 判断是否全屏
      if (!isFullScreen) {
        this.launchFullScreen(document.documentElement); // 整个页面全屏
        // launchFullScreen(document.getElementById('btn')); // 某个元素全屏
      }
    });
  }

  setDefatulMenu(result) {
    let url = '';
    if (this.router.url && this.router.url.length > 1) {
      url = this.router.url;
    } else {
      url = '/' + localStorage.getItem('__top_url__');
    }

    if (result == null) {
      this.router.navigate(['']);
      return;
    } else {
      let first_url = '/store/menu-mgmt';
      let set_d = false;
      if ( result.auth_menu.length==2 ) {
        set_d = true;
      }
      // tslint:disable-next-line: forin
      for (let i in result.auth_menu) {
        let path = result.auth_menu[i]['menu_path'];
        if (path=='/') {
          continue;
        }
        if ( set_d ) {
          first_url = path;
        }
        if (url && (url == path || RegExp(url).test(path)) ) {
          this.router.navigate(['/' + url, {}]);
          return;
        }
        // if (first_url=='') {
        //   first_url = path;
        // }
      }
      this.router.navigate([first_url, {}]);
    }
  }

  launchFullScreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
  // 退出全屏
  exitFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document['mozExitFullScreen']) {
      document['mozExitFullScreen']();
    } else if (document['webkitExitFullscreen']) {
      document['webkitExitFullscreen']();
    }
  }

  fullScreen() {

    const isFullScreen = document.fullscreenElement || document['mozFullScreenElement'] || document['webkitFullscreenElement'];// 判断是否全屏
    if (!isFullScreen) {
      ; // 整个页面全屏
      // launchFullScreen(document.getElementById('btn')); // 某个元素全屏
    } else {
      this.exitFullScreen();
    }
    // 当前处于全屏状态的元素 element.
    const fullScreenElement = document.fullscreenEnabled || document['mozFullScreenElement'] || document['webkitFullscreenElement'];
    // 标记 fullScreen 当前是否可用.
    const fullScreenEnabled = document.fullscreenEnabled || document['mozFullscreenEnabled'] || document['webkitFullscreenEnabled'];

  }

}



