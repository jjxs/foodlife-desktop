import { Component, OnInit, ViewChild, Output, Inject, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';

import * as _moment from 'moment';
const moment =  _moment;

@Component({
  selector: 'app-inventorycontrol-check-confirm',
  templateUrl: './check-confirm.component.html',
  styleUrls: ['./check-confirm.component.css']
})
export class InventorycontrolCheckConfirmComponent implements OnInit, AfterViewInit {

    // 編集フォーム
    form: FormGroup;
    lists = [];

    constructor(
      private dialog: MatDialog,
      private json: JsonService,
      private fb: FormBuilder,
      private cmp: CmpService,
      public dialogRef: MatDialogRef<InventorycontrolCheckConfirmComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.lists = data;
      this.form = this.fb.group({
        inspector: ['', Validators.required],
        inspection_date: [(new Date()).toLocaleDateString(), Validators.required],
        remarks: [''],
      });
    }


    ngOnInit() {
    }

    ngAfterViewInit(): void {

    }
    onCancel() {
      this.dialogRef.close(1);
    }

    onSave() {
      if (this.form.valid) {
        let params = {};
        params = this.form.value;
        params['lists'] = this.lists;
        this.json.post('s/s03p01/post_check/', params).subscribe((response) => {
          if (response) {
            this.cmp.pop(response['message']);
            if ( response['result'] ) {
              this.form.reset();
              this.onCancel();
            }
          }
        });
      }
    }

}
