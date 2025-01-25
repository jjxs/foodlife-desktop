import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CmpWindowService, JsonService, CmpService, JsonResult } from 'app-lib';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-option',
  templateUrl: './add-option.component.html',
  styleUrls: ['./add-option.component.css']
})
export class AddOptionComponent implements OnInit {

  // データフォーム
  dataForm: FormGroup;

  // データフォーム
  parents = [];

  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<AddOptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataForm = this.fb.group({
      display_name: '',
      display_order: '',
      group_id: ''
    });

    this.parents = data["parents"]
  }

  ngOnInit() {
  }

  onAdd() {
    if (this.dataForm.valid) {
      this.json.post('s/menu_mgmt_api/add_option_data', this.dataForm.value)
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
    this.dialogRef.close(false);
  }

}
