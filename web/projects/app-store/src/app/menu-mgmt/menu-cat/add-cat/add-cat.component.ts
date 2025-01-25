import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CmpWindowService, JsonService, CmpService, JsonResult } from 'app-lib';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-cat',
  templateUrl: './add-cat.component.html',
  styleUrls: ['./add-cat.component.css']
})
export class AddCatComponent implements OnInit {

  // データフォーム
  dataForm: FormGroup;

  // データID
  currentID = null;

  // データフォーム
  parents = [];

  constructor(
    private fb: FormBuilder,
    // private win: CmpWindowService,
    private cmp: CmpService,
    private json: JsonService,
    public dialogRef: MatDialogRef<AddCatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataForm = this.fb.group({
      display_name: '',
      display_order: '',
      group_id: ''
    });
    this.parents = data;
  }

  ngOnInit() {
  }

  onAdd() {
    if (this.dataForm.valid) {
      this.json.post('s/menu_mgmt_api/add_cat_data', this.dataForm.value)
        .subscribe((response: JsonResult) => {
          if (response) {
            this.cmp.pop(response.message);
            if (response.result) {
              this.dialogRef.close(true);
            }
          }
        });
    }
  }

  onCancel() {
    this.dataForm.reset();
    //this.currentID = null;
    //this.edit.emit(false);
    this.dialogRef.close(false);
  }

}
