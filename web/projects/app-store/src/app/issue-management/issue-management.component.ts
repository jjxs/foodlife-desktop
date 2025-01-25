import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { JsonService, Util, PagingComponent, JsonResult, CmpService } from 'app-lib';
import { MatTableDataSource } from '@angular/material';
import { appendFile } from 'fs';
import { Button } from 'protractor';

@Component({
  selector: 'app-issue-management',
  templateUrl: './issue-management.component.html',
  styleUrls: ['./issue-management.component.css']
})
export class IssueManagementComponent implements OnInit {

  @ViewChild(PagingComponent, { static: false }) paging: PagingComponent;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['goods_issue_number', 'part_name', 'parts_type',
    'goods_issue_quantity', 'base', 'issue_date', 'remarks', 'button'];

  // 検索フォーム
  searchForm: FormGroup;

  // 明細フォーム
  issuemanagementForm: FormGroup;

  // 出庫リスト
  issuelist = [];

  // べ－スリスト
  baselist = [];

  // 明細フラグ
  issuemanagementflg = true;
  dataSize = 0;

  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private cmp: CmpService

  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      issue_date: ['', []],
      part_name: ['', []],
      part_id: ['', []],
      parts_type: ['', []],
    });

    this.issuemanagementForm = this.fb.group({
      id: ['', []],
      part_id: ['', []],
      goods_issue_number: ['', []],
      parts_type: ['', []],
      issue_date: ['', []],
      product_unit: ['', []],
      base: ['', []],
      goods_issue_quantity: ['', []],
      delivery_status_checker: ['', []],
      goods_issue_indicator: ['', []],
      remarks: ['', []]
    });
    this.issueInfo();
    this.baseInfo();
  }

  issueInfo() {
    this.json.post('s/s04p01/get_issue_info/', {}).subscribe((response?: JsonResult) => {

      if (response.data) {
        this.issuelist = response.data;
      }
    });
  }

  baseInfo() {
    this.json.post('s/s04p01/get_base_info', {}).subscribe((response?: JsonResult) => {

      if (response.data) {
        this.baselist = response.data;
      }
    });
  }

  onSearch() {
    let params = Util.appendIf(this.searchForm.value, this.paging.getParam());
    this.dataSource.data = [];

    this.json.get('s/s04p01/get_issue_data/', params).subscribe((response) => {

      if (response["data"]) {
        console.log(response["data"])
        this.dataSource.data = response["data"].rows;
        this.dataSize = response["data"].count;
      }
    });

  }

  onSave() {
    this.issuemanagementflg = false;
    if (this.issuemanagementForm.valid) {
      let params = this.issuemanagementForm.value;
      this.json.post('s/s04p01/get_data_click/', params).subscribe((response) => {
        if (response) {
          this.cmp.pop(response['message']);
          this.issuemanagementflg = false;
          this.issuemanagementForm.reset();
        }
      })

    }
  }

  onClear() {

    this.searchForm.reset();
  }

  onEdit(row) {
    this.issuemanagementflg = true;
    this.json.post('s/s04p01/get_issue_detail_data/', { id: row['id'] }).subscribe((response?: JsonResult) => {
      if (response.data) {
        this.issuemanagementForm.patchValue(response.data);
      }
    });
  }

  onAddnew() {

    this.issuemanagementflg = true;
  }

  onSelectPart(event) {
    const index = this.issuelist.findIndex(data => data['id'] === event.value);
    if (index >= 0) {
      const selectedCheck = this.issuelist[index];
      this.issuemanagementForm.get('parts_type').setValue(selectedCheck['parts_type']);
      this.issuemanagementForm.get('part_unit').setValue(selectedCheck['part_unit']);
    } else {
      this.issuemanagementForm.get('parts_type').setValue('');
      this.issuemanagementForm.get('part_unit').setValue('');
    }
  }

  onSelectBase(event) {
    const index = this.baselist.findIndex(data => data['id'] === event.value);
    const selectedCheck = this.baselist[index];
  }

  onDelete() {
    let params = this.issuemanagementForm.value;
    this.json.post('s/s04p01/get_delete_data/', params).subscribe((response?: JsonResult) => {
      if (response)
        this.cmp.pop(response['message']);
      this.issuemanagementflg = false;
      this.issuemanagementForm.reset();
    });
  }
}
