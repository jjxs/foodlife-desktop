import { JsonService, Util } from 'ami';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Router, NavigationEnd } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class AppService {

    private system_name = '';
    private fax = 0;
    private version = '';
    private shopInfo = null;
    private siteImageHost = '';
    private kitchenPrinter = false;
    private takeoutPrinter = false;
    private counterReport = false;
    private qrcode = false;
    private counterManager = false;

    private unknow_language = {};
    private __lindex = {};
    private __language = {
        'ja' : [],
        'zh' : [],
        'en' : []
    };

    public shopinfo_config_key = 'shopinfo';
    get SystemName(): string {
        return this.system_name;
    }

    get Fax(): number {
        return this.fax;
    }

    get ShopInfo() {
        return this.shopInfo;
    }

    get SiteImageHost() {
        return this.siteImageHost;
    }
    get Version(): string {
        return this.version;
    }

    private versionSource = new Subject<boolean>();
    version$ = this.versionSource.asObservable();

    private languageChangedSource = new Subject<String>();
    languageChanged$ = this.languageChangedSource.asObservable();

    constructor(
        private router: Router,
        private jsonSrv: JsonService
    ) { }

    init() {
        this.initLanguageData();
        this.jsonSrv.get('master/app').subscribe((response) => {
            if (!Util.isEmpty(response['data'])) {
                this.system_name = response['data']['system_name'];
                document.title = this.system_name;
                this.fax = response['data']['fax'];
                this.version = response['data']['version'];
                this.versionSource.next(this.version === environment.version);
                this.siteImageHost = response['data']['siteImageHost'];
                Util.setImageHost(this.siteImageHost);
                const plugin = response['data']['plugin'];
                if ( !Util.isEmpty(plugin) ) {
                    // tslint:disable-next-line: forin
                    Util.setCanQr('');
                    for ( const i in plugin ) {
                        if ( plugin[i]['plugin_name'] === 'kitchprinter' ) {
                            this.kitchenPrinter = true;
                        } else if ( plugin[i]['plugin_name'] === 'takeout' ) {
                            this.takeoutPrinter = true;
                        } else if ( plugin[i]['plugin_name'] === 'qrcode' ) {
                            this.qrcode = true;
                            Util.setCanQr(1);
                        } else if ( plugin[i]['plugin_name'] === 'counter_report') {
                            this.counterReport = true;
                        } else if ( plugin[i]['plugin_name'] === 'order_manager') {
                            this.counterManager = true;
                        }
                    }
                }
                console.log(this.version, environment.version);
            }
        });
        console.info('init app');
        this.initShopInfo();
        this.postLanguage();
    }

    canKitchenPrinter() {
        return this.kitchenPrinter;
    }

    canTakeoutPrinter() {
        return this.takeoutPrinter;
    }

    showMenu(menu='') {
        if ( menu=='counter' ) {
            return this.counterManager;
        }
    }


    initShopInfo() {
        this.jsonSrv.get('restaurant/master/config/', {'key': this.shopinfo_config_key}).subscribe((response?: any[]) => {
            if (!Util.isEmpty(response) && response['config'] && !Util.isEmpty(response['config']['value'])) {
                this.shopInfo = response['config']['value'];
            } else {
                this.shopInfo = {
                    'name': '',
                    'post': '',
                    'tel' : '',
                    'addr1': '',
                    'addr2': '',
                    'time1': '',
                    'time2': '',
                    'charset': 'Shift_JIS'
                };
            }
        });
    }

    postLanguage() {
        setTimeout(() => {
            if ( Object.keys(this.unknow_language).length > 0 ) {
                this.jsonSrv.post('restaurant/master/post_language/', {'key': this.unknow_language}).subscribe((response) => {
                    if (!Util.isEmpty(response)) {
                        this.unknow_language = {};
                        this.initLanguageData();
                    }
                });
            }
            this.postLanguage();
          }, 10000);
    }
    initLanguageData() {
        this.jsonSrv.get('restaurant/master/language/', {}).subscribe((response: any) => {
            if (!Util.isEmpty(response) && response[0]) {
                response.forEach((element: any) => {
                    if ( Util.isEmpty(this.__lindex[element['ja']]) ) {
                        this.__lindex[element['ja']] = this.__language['ja'].length;
                        this.__language['ja'].push(element['ja']);
                        this.__language['en'].push(element['en']);
                        this.__language['zh'].push(element['zh']);
                    } else {
                        const index = this.__lindex[element['ja']];
                        this.__language['ja'][index] = element['ja'];
                        this.__language['en'][index] = element['en'];
                        this.__language['zh'][index] = element['zh'];
                    }
                });
            }
        });
    }

    setLanguage(language) {
        localStorage.setItem('__language__', language );
        this.languageChangedSource.next(language);
    }
    getLanguage() {
        return localStorage.getItem('__language__');
    }

    language(key) {
        const language = this.getLanguage();
        let tk = 'ja';
        if ( language === 'en' ) {
            tk = 'en';
        } else if ( language === 'zh' ) {
            tk = 'zh';
        }

        if ( this.__lindex[key] != undefined ) {
            const index = this.__lindex[key];
            const val = this.__language[tk][index];
            if ( val != null ) {
                return val;
            }
        }
        this.unknow_language[key] = 1;
        return key;
    }

    public get_mac() {
        if ( typeof amiJs === 'undefined' ) {
            return "";
        }
        return amiJs.getMac();
    }
}

declare module amiJs {
    export function counter_print(data): any;
    export function detail_print(data): any;
    export function open_cash_box(): any;
    export function accounting_day_print(data): any;
    export function getMac(): any;
}
