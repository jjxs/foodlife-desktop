import {
  Component,
  OnInit,
  Inject,
  Output,
  EventEmitter,
  Input,
} from '@angular/core'
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { JsonService, JsonResult, CmpService } from 'app-lib'
import { Util } from 'ami'

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css'],
})
export class MenuEditComponent implements OnInit {
  // データフォーム
  dataForm: FormGroup

  // データID
  currentID = null
  can_qr = false
  show_time_list = [
    { id: 'lunch', name: 'ランチ' },
    { id: 'dinner', name: 'ディナー' },
    { id: '', name: '任意' },
  ]
  time_list = [
    { id: '', name: '' },
    { id: 0, name: '0時' },
    { id: 1, name: '1時' },
    { id: 2, name: '2時' },
    { id: 3, name: '3時' },
    { id: 4, name: '4時' },
    { id: 5, name: '5時' },
    { id: 6, name: '6時' },
    { id: 7, name: '7時' },
    { id: 8, name: '8時' },
    { id: 9, name: '9時' },
    { id: 10, name: '10時' },
    { id: 11, name: '11時' },
    { id: 12, name: '12時' },
    { id: 13, name: '13時' },
    { id: 14, name: '14時' },
    { id: 15, name: '15時' },
    { id: 16, name: '16時' },
    { id: 17, name: '17時' },
    { id: 18, name: '18時' },
    { id: 19, name: '19時' },
    { id: 20, name: '20時' },
    { id: 21, name: '21時' },
    { id: 22, name: '22時' },
    { id: 23, name: '23時' },
    { id: 24, name: '24時' },
  ]

  constructor(
    private json: JsonService,
    private fb: FormBuilder,
    private cmp: CmpService,
    public dialogRef: MatDialogRef<MenuEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataForm = this.fb.group({
      display_name: ['', Validators.required],
      display_order: ['', [Validators.required]],
      // option_display: [''],
      option_img: [''],
      show_time: [],
      show_start_time: 0,
      show_end_time: 24,
    })
    let params = {}
    params['parent_id'] = data
    this.json
      .post('s/menu_mgmt_api/select_parent_data', params)
      .subscribe((response: JsonResult) => {
        if (response.message == 'Success') {
          if (response.result) {
            this.currentID = data
            this.dataForm.patchValue(response.data)
            if (!Util.isEmpty(response.data['option_show_time'])) {
              this.dataForm
                .get('show_time')
                .setValue(response.data['option_show_time'])
            }
            if (response.data['option_show_time'] instanceof Array) {
              if (response.data['option_show_time'].length != 2) {
                return
              } else {
                this.dataForm
                  .get('show_start_time')
                  .setValue(response.data['option_show_time'][0])
                this.dataForm
                  .get('show_end_time')
                  .setValue(response.data['option_show_time'][1])
              }
            }
            if (Util.canQr()) {
              this.can_qr = true
            }
            // this.dialogRef.close("1");
          }
        }
      })
  }

  ngOnInit() {}

  onSave() {
    const params = this.dataForm.value
    params['id'] = this.currentID
    params['flag'] = 'parent'
    if (
      !Util.isEmpty(params['show_start_time']) &&
      !Util.isEmpty(params['show_end_time'])
    ) {
      params['show_time'] = [params['show_start_time'], params['show_end_time']]
    }
    if (
      Util.isEmpty(params['show_start_time']) ||
      Util.isEmpty(params['show_end_time'])
    ) {
      params['show_time'] = []
    }
    if (params['show_start_time'] > params['show_end_time']) {
      document.getElementById('address').hidden = false
      ;(<HTMLInputElement>document.getElementById('address1')).innerHTML =
        '正しく期間入力してください(可见終了時間が可见開始時間よりも長い)'
    } else {
      if (this.dataForm.valid) {
        this.json
          .post('s/menu_mgmt_api/update_data', params)
          .subscribe((response: JsonResult) => {
            if (response) {
              this.cmp.pop(response.message)
              if (response.result) {
                this.dialogRef.close(true)
              }
            }
          })
      }
    }
  }

  onCancel() {
    this.dataForm.reset()
    this.currentID = null
    // this.edit.emit(false);
    this.dialogRef.close(false)
  }
}
