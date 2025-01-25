import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-setsubi-manager',
  templateUrl: './setsubi-manager.component.html',
  styleUrls: ['./setsubi-manager.component.css']
})
export class SetsubiManagerComponent implements OnInit {

  @ViewChild('empty', { static: false }) empty: TableEmptyMessageComponent;

  searchForm: FormGroup;

  dataSource = new MatTableDataSource<any>([]);

  // チェックボックスセレクション
  selection = new SelectionModel<any>(true, []);

  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private cmp: CmpService
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      keyword: ''
    });
  }

  ngAfterViewInit(): void {
    this.onSearch();
  }

  onSearch() {
    this.empty.refreshFlg = false;
    this.dataSource.data = [];
    this.selection.clear();
    this.json.post('s/setsubi_api/get_setsubi_data', {}).subscribe((response: JsonResult) => {
      if (response) {
        this.empty.refreshFlg = true;
        this.dataSource.data = response.data;
      }
    });
  }

  onBind(machine) {
    this.cmp.confirm('選択された設備を使用しますか？').afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.json.post('s/setsubi_api/bind', machine).subscribe((response: JsonResult) => {
          if (response) {
            this.cmp.pop(response.message);
            this.onSearch();
          }
        });
      }
    });
  }

  onDelete(machine) {
    this.cmp.confirm('選択された設備を解除しますか？').afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.json.post('s/setsubi_api/del_setsubi_data', machine).subscribe((response: JsonResult) => {
          if (response) {
            this.cmp.pop(response.message);
            this.onSearch();
          }
        });
      }
    });
  }
}
