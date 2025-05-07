import { JsonResult, TableEmptyMessageComponent, JsonService, CmpService } from 'app-lib';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { SeatEditManagerComponent } from './seat-edit-manager/seat-edit-manager.component';

@Component({
    selector: 'seat-manager',
    templateUrl: './seat-manager.component.html',
    styleUrls: ['./seat-manager.component.css']
})
export class SeatManagerComponent implements OnInit {
    takeout = false;
    dataSource = new MatTableDataSource<any>([]);

    // チェックボックスセレクション
    selection = new SelectionModel<any>(true, []);

    constructor(
        private dialog: MatDialog,
        private json: JsonService,
        private cmp: CmpService) {
    }

    ngOnInit() {
        this.onSearch();
    }

    onSearch() {
        let host = window.location.hostname.split('.');
        let saasId = host[0];
        // let saasId = "test";
        let params = {
            'takeout': 1
        };
        if (this.takeout == false) {
            params['takeout'] = 0;
        }
        this.dataSource.data = [];
        this.selection.clear();
        this.json.post('s/seat_manager_api/get_seat_data', params).subscribe((response: JsonResult) => {
            if (response) {
                this.dataSource.data = response.data;
                if (this.dataSource.data.length>0) {
                    this.dataSource.data.forEach(e => {
                        let qrLink = "http://{{saas_id}}.app.ymtx.co.jp/?s={{saas_id}}&seat={{seat_id}}&sign={{36_code}}"
                        e.isHasQrImage = false
                        let str = saasId + e.id
                        e.qr = qrLink.replace(/{{saas_id}}/g,saasId).replace("{{seat_id}}",e.id).replace("{{36_code}}", this.to36code(str))
                    })
                }
            }
        });
    }

    onAdd() {
        const dialog = this.dialog.open(SeatEditManagerComponent, {
            width: '700px',
            height: '600px',
        })
        dialog.afterClosed().subscribe(result => {
            if (result == "1") {
                this.onSearch();
            }
        });
    }

    onEdit(event) {
        const dialog = this.dialog.open(SeatEditManagerComponent, {
            width: '700px',
            height: '600px',
            data: event
        })
        dialog.afterClosed().subscribe(result => {
            if (result == "1") {
                this.onSearch();
            }
        });
    }

    onDelete(row?) {
        this.cmp.confirm('選択されたカテゴリーを削除しますか？').afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.doDelete(row);
            }
        });
    }
    doDelete(row) {
        const params = {
            rows: row
        };
        this.json.post('s/seat_manager_api/delete_seat_data', params).subscribe((response: JsonResult) => {
            if (response.result != undefined) {
                this.cmp.pop(response.message);
                this.onSearch();
            } else {
                this.cmp.pop('削除できませんでした');
            }
        });
    }

    onCheckChange(event) {
        this.takeout = event.checked;
        this.onSearch();
    }
    to36code(signstr) {
        const l = 'd9sqbr6jmcehgwx1t8kni7puf24oa503ylvz';
        let code = 0; // tslint:disable-next-line: forin
        for (const i in signstr) {
          code += parseInt(signstr[i].charCodeAt()) * Math.pow(parseInt(i) + 1, 2);
        } // console.info(code)
        let sign = '';
        while (true) {
          const m = code % 36;
          sign = sign + l[m];
          code = Math.floor(code / 36);
          if (code < 36) {
            sign = sign + l[code];
            break;
          }
        }
        return sign;
    };
}

