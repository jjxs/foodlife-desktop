import { Component, OnInit, Output, Inject, EventEmitter, Input } from '@angular/core';
import { CmpWindowService, JsonService, JsonResult, CmpService } from 'app-lib';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {

  @Output() edit = new EventEmitter<any>();
  @Output() saved = new EventEmitter<any>();

  // データフォーム
  dataForm: FormGroup;

  // データID
  currentID = null;

  // 親リスト
  parents = [];

  // 親選択可能
  hasParent = true;

  constructor(
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<SupplierEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataForm = this.fb.group({
      id: [],
      sup_name: ['', [Validators.maxLength(32), Validators.required]],
      sup_tel: ['', [Validators.maxLength(20)]],
      sup_addr: ['', [Validators.maxLength(64)]],
    });
    this.dataForm.patchValue(data);
  }

  ngOnInit() {
  }

  onSave() {
    const params = this.dataForm.value;
    if (this.dataForm.valid) {
      this.json.post('s/shop_cost_api/set_supplier', params).subscribe((response: JsonResult) => {
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
