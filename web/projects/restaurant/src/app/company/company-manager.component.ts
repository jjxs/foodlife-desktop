import { JsonResult, TableEmptyMessageComponent, JsonService, CmpService } from 'app-lib';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { CompanyEditManagerComponent } from './company-edit-manager/company-edit-manager.component';

@Component({
    selector: 'company-manager',
    templateUrl: './company-manager.component.html',
    styleUrls: ['./company-manager.component.css']
})
export class CompanyManagerComponent implements OnInit {

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
        this.dataSource.data = [];
        this.selection.clear();
        this.json.post('s/takeout_user_manager_api/get_company_data', {}).subscribe((response: JsonResult) => {
            if (response) {
                this.dataSource.data = response.data;
            }
        });
    }

    onAdd() {
        const dialog = this.dialog.open(CompanyEditManagerComponent, {
            width: '700px',
            height: '450px',
        });
        dialog.afterClosed().subscribe(result => {
            if (result == "1") {
                this.onSearch();
            }
        });
    }

    onEdit(event) {
        const dialog = this.dialog.open(CompanyEditManagerComponent, {
            width: '700px',
            height: '450px',
            data: event
        });
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
        this.json.post('s/takeout_user_manager_api/delete_company_data', params).subscribe((response: JsonResult) => {
            if (response.result != undefined) {
                this.cmp.pop(response.message);
                this.onSearch();
            } else {
                this.cmp.pop('削除できませんでした');
            }
        });
    }
}

