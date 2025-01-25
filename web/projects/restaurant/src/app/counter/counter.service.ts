import { JsonService, Util, JsonResult } from 'ami';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { CounterDetailOrder } from './counter.interface';
import { CmpService } from '../cmp/cmp.service';
import { AppService } from '../app.service';
import { Menu } from '../menu/menu.interface';

@Injectable({
    providedIn: 'root'
})


export class CounterService {



    isConnecting: boolean = false;

    public connecting: WebSocket;

    // 会計完了
    private afterCounterSource = new Subject<any>();
    afterCounter$ = this.afterCounterSource.asObservable();

    // 合計金額
    private countPriceChangedSource = new Subject<number>();
    countPriceChanged$ = this.countPriceChangedSource.asObservable();


    constructor(
        private jsonSrv: JsonService,
        private app: AppService,
        private cmp: CmpService
        // private authSrv: AuthenticationService
    ) {
    }

    counter(params) {
        // this.cmp.loading();
        // 注文明細を取得
        this.jsonSrv.post('restaurant/counter/counter/', params).subscribe((response?: JsonResult) => {

            // console.log('this.afterCounterSource', response)
            if (!Util.isEmpty(response)) {
                this.afterCounterSource.next(response);
                // this.cmp.unloading();
            }
        })
    }


    isPriceFree(element: CounterDetailOrder) {
        if (element.is_delete) {
            return true;
        }

        if (!element.is_ready) {
            return true;
        }

        if (element.price === 0) {
            return true;
        }
        return false;
    }

    tax(total) {
        return Math.floor(total * (1 + this.app.Fax / 100));
    }
    getShopInfo() {
        return this.app.ShopInfo;
    }

    get_fax() {
        return this.app.Fax;
    }

    // 税抜きから税金算出
    tax_value(total) {
        return Math.floor(total * this.app.Fax / 100);
    }

    // // 税込から税金算出
    // tax_in_value(total) {
    //     return total - Math.floor(total / (1 + this.app.Fax / 100))
    // }
    // ※誤差が大きいのため、サーバ側計算する

    checkTax(menu: Menu) {
        if (menu.tax_in) {
            // return this.tax(menu.price);
            return menu.price;
        }



        return menu.price;
    }

    countPriceTaxIn(element: CounterDetailOrder) {
        if (!element.tax_in) {
            return 0;
        }

        if (this.isPriceFree(element)) {
            return 0;
        }

        // return this.tax(element.price) * element.count;
        return element.price * element.count;

    }

    countPrice(element: CounterDetailOrder) {
        if (element.tax_in) {
            return 0;
        }

        if (this.isPriceFree(element)) {
            return 0;
        }

        return element.price * element.count;
    }

    sendMonitor(type, money) {
        this.jsonSrv.post('restaurant/counter/notice_monitor/',
            {
                'type': type,
                'faxprice': money.amounts_actually,
                'price': money.total,
                'pay': money.pay,
                'change': money.change,
            })
            .subscribe((response?) => { });
    }

    countPriceChanged(countPrice: number) {
        this.countPriceChangedSource.next(countPrice);
    }

    public isPad() {
        if ( typeof amiJs === 'undefined' ) {
            return false;
        } else {
            return true;
        }
    }

    public counter_print(data) {
        if ( typeof amiJs === 'undefined' ) {
            return false;
        }
        amiJs.counter_print(JSON.stringify(data));
        return true;
    }

    public detail_print(data) {
        if ( typeof amiJs === 'undefined' ) {
            return false;
        }
        amiJs.detail_print(JSON.stringify(data));
        return true;
    }

    public open_cash_box() {
        if ( typeof amiJs === 'undefined' ) {
            return false;
        }
        amiJs.open_cash_box();
        amiJs.open_cash_box();
        return true;
    }
    public accounting_day_print(data) {
        if ( typeof amiJs === 'undefined' ) {
            return false;
        }
        amiJs.accounting_day_print(JSON.stringify(data));
        return true;
    }

}

declare module amiJs {
    export function counter_print(data): any;
    export function detail_print(data): any;
    export function open_cash_box(): any;
    export function accounting_day_print(data): any;
}