import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JsonService, JsonResult } from 'app-lib';
import { MatStepper } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-reg',
  templateUrl: './store-reg.component.html',
  styleUrls: ['./store-reg.component.css']
})
export class StoreRegComponent implements OnInit {

  // 店舗基本情報フォーム
  storeInfoForm: FormGroup;

  // 店舗基本情報確認
  storeInfo = [];

  // 店舗サイト情報フォーム
  storeSiteForm: FormGroup;

  // 店舗基本情報確認
  storeSite = [];

  // 都道府県
  states: [];

  // ステッパー完了
  editable = true;

  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private router: Router,
    private elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit() {
    this.storeInfoForm = this.fb.group({
      store_code: ['', [Validators.required, Validators.maxLength(32)]],
      store_name: ['', [Validators.required, Validators.maxLength(64)]],
      postal_code: ['', [Validators.maxLength(16)]],
      state: '',
      city: ['', [Validators.maxLength(32)]],
      street_address: ['', [Validators.maxLength(64)]],
      building_name: ['', [Validators.maxLength(64)]],
      phone_number: ['', [Validators.maxLength(32)]],
      opening_time: ['', [Validators.maxLength(128)]],
      remarks: ['', [Validators.maxLength(512)]]
    });

    this.storeSiteForm = this.fb.group({
      ip_address: ['', [Validators.required, Validators.maxLength(64)]],
      port_no: ['', [Validators.required, Validators.maxLength(8)]],
      db_name: ['', [Validators.required, Validators.maxLength(32)]],
      db_port_no: ['', [Validators.required, Validators.maxLength(8)]],
      db_host: ['', [Validators.required, Validators.maxLength(128)]],
      db_user: ['', [Validators.required, Validators.maxLength(16)]],
      db_password: ['', [Validators.required, Validators.maxLength(32)]],
      client_ip: ['', [Validators.required, Validators.maxLength(64)]],
      client_port_no: ['', [Validators.required, Validators.maxLength(8)]],
      server_ip: ['', [Validators.required, Validators.maxLength(64)]],
      server_port_no: ['', [Validators.required, Validators.maxLength(8)]],
      websocket_ip: ['', [Validators.required, Validators.maxLength(64)]],
      websocket_port_no: ['', [Validators.required, Validators.maxLength(8)]]
    });

    // 初期データ取得
    this.json.post('s/store_reg_api/init_data', {}).subscribe((response?: JsonResult) => {
      if (response.data) {
        this.states = response.data.states;
      }
    });
  }

  onCheck(event) {
    console.log(event);
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(form: FormGroup, stepper: MatStepper) {
    form.markAllAsTouched();
    if (form.valid) {
      // 確認用データ
      if (stepper.selectedIndex === 1) {
        this.getConfirmData();
      }
      stepper.selected.completed = true;
      // stepper.selected.editable = false;
      stepper.next();
    }
  }

  onRegister(stepper: MatStepper) {
    const params = {
      info: this.storeInfoForm.value,
      site: this.storeSiteForm.value
    };
    this.json.post('s/store_reg_api/set_data', params).subscribe((response?: JsonResult) => {
      if (response.result) {
        stepper.selected.completed = true;
        this.editable = false;
        stepper.next();
      }
    });
  }

  onClose() {
    this.router.navigate(['']);
  }

  onContinue(stepper: MatStepper) {
    this.storeInfoForm.reset();
    this.storeSiteForm.reset();
    stepper.reset();
    this.editable = true;

  }

  getConfirmData() {
    const infoValue = this.storeInfoForm.value;
    const siteValue = this.storeSiteForm.value;
    Object.keys(infoValue).forEach(key => {
      let name = '';
      const el = this.elementRef.nativeElement.parentElement.querySelector('[formControlName=\'' + key + '\']');
      if (el) {
        name = (el.getAttribute('placeholder') || el.getAttribute('ng-reflect-placeholder'));
      }
      let value = infoValue[key];
      if (key === 'state') {
        const stateIndex = this.states.findIndex((item) => item['code'] === value);
        value = this.states[stateIndex]['display_name'];
      }
      const tmp = {
        name,
        value
      };
      this.storeInfo.push(tmp);
    });
    Object.keys(siteValue).forEach(key => {
      let name = '';
      const el = this.elementRef.nativeElement.parentElement.querySelector('[formControlName=\'' + key + '\']');
      if (el) {
        name = (el.getAttribute('placeholder') || el.getAttribute('ng-reflect-placeholder'));
      }
      const value = siteValue[key];
      const tmp = {
        name,
        value
      };
      this.storeSite.push(tmp);
    });
  }

}
