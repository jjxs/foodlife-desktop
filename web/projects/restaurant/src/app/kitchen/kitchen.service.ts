import { JsonService, Util } from "ami";
import { Subject } from "rxjs";
import { environment } from '../../environments/environment';
import { Injectable } from "@angular/core";
import { timeout } from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class KitchenService {

    isConnecting: boolean = false;

    public connecting: WebSocket;

    //（Websocketイベント）　注文になる際に発火する
    private orderSource = new Subject<any>();
    order$ = this.orderSource.asObservable();

    //（Websocketイベント）　取消際に発火する
    private orderDeletedSource = new Subject<any>();
    orderDeleted$ = this.orderDeletedSource.asObservable();

    
    //（Websocketイベント）　取消際に発火する
    private orderChangedSource = new Subject<any>();
    orderChanged$ = this.orderChangedSource.asObservable();

    private errorSource = new Subject<any>();
    error$ = this.errorSource.asObservable();

    constructor(
        private jsonSrv: JsonService
        // private authSrv: AuthenticationService
    ) {
    }

    startWebsocket(watch_list: Array<number>) {
        try {
            this.isConnecting = false;
            this.closeWebsocket();
        } catch (error) {
        }
        if (Util.isEmptyArray(watch_list)) {
            return;
        }
        try {
            this.connecting = new WebSocket(
                'ws://' + environment.socket_ip +
                '/ws/kitchen/' + Util.encode(watch_list) + '/');
            this.isConnecting = true;
        } catch (error) {
            this.isConnecting = false;
            this.errorSource.next({
                error: 'create',
                message: '接続できません！',
                event: error,
            })
        }

        this.connecting.onerror = ((ev: Event) => {
            console.log(ev);

            // this.isConnecting = false;
            this.errorSource.next({
                error: 'error',
                message: 'エラーは発生しました！',
                event: ev,

            })
        })

        this.connecting.onmessage = ((result) => {
            this.isConnecting = true;
            if (!Util.isEmpty(result) && !Util.isEmpty(result["data"])) {

                //console.log("☆☆☆☆☆☆☆", result["data"]);

                const data = Util.decode(result["data"]);
                if (data['type'] === 'order_add') {
                    const tasks = Util.decode(data['kitchen_data']);
                    this.orderSource.next(tasks);
                }

                if (data['type'] === 'order_delete') {
                    const details = Util.decode(data['detail_id']);
                    this.orderDeletedSource.next(details);
                }

                if (data['type'] === 'order_change') {
                    this.orderChangedSource.next();
                }

                //console.log(" this.connecting.onmessage ")
                //console.log(data)
            }
        });

        this.connecting.onclose = ((e) => {
            // console.log("  this.connecting.onclose ")
            //　接続エラーの場合もう一回接続する            
            this.errorSource.next({
                error: 'close',
                message: '接続が閉じました！',
                event: e,

            });
            this.isConnecting = false;
        });

        this.connecting.onopen = ((e) => {

            // console.log("  this.connecting.onopen ")
            this.isConnecting = true;
        });
    }

    //seat_using_stop 
    closeWebsocket() {
        try {
            if (this.connecting != null)
                this.connecting.close();
        } catch (error) {
            // console.log(" this.connecting.close(); => Error")
            this.isConnecting = false;
        } finally {
            this.connecting = null;
        }
    }


}
