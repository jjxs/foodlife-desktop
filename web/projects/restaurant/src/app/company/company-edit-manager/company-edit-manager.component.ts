import { Component, OnInit, ViewChild, Output, Inject, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'company-edit-manager',
  templateUrl: './company-edit-manager.component.html',
  styleUrls: ['./company-edit-manager.component.css']
})
export class CompanyEditManagerComponent implements OnInit {

  // 編集フォーム
  editForm: FormGroup;
  // ID
  currentID = null;

  constructor(
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<CompanyEditManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      user_id: ['', Validators.required],
      user_name: ['', []],
      user_tel: ['', Validators.required],
      user_address: ['', Validators.required],
      seat_no: ['', []]
    });
    if (data != null) {
      if (Object.keys(data).length !== 0) {
        const params = this.editForm.value;
        params['id'] = data['id'];
        this.json.post('s/takeout_user_manager_api/get_company_edit_data', params).subscribe((response: JsonResult) => {
          if (response.data) {
            this.editForm.patchValue(response.data.result[0]);
            this.currentID = params['id'];
          }
        });
      }
    }
  }

  ngOnInit() {
  }

  onCancel() {
    this.editForm.reset();
    this.dialogRef.close();
  }

  onSave() {
    const params = this.editForm.value;
    params['id'] = this.currentID;
    Object.values(this.editForm.controls).forEach((c: FormControl) => c.markAsTouched());
    if (params['user_address'].length > 200) {
      document.getElementById('address').hidden = false;
      (<HTMLInputElement>document.getElementById('address1')).innerHTML = '长度最大200';
    } else {
      document.getElementById('address').hidden = true;
      if (this.editForm.valid) {
        this.json.post('s/takeout_user_manager_api/set_company_data', params).subscribe((response: JsonResult) => {
          if (response) {
            this.cmp.pop(response.message);
            if (response.result) {
              this.dialogRef.close("1");
            }
          }
        });
      }
    }
  }
}
