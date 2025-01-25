import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { JsonService, JsonResult, TableEmptyMessageComponent, CmpService, Util } from 'app-lib';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { PaymentListComponent } from './payment-list/payment-list.component';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
  })

export class PaymentComponent implements OnInit {

    menuData = [];

  @ViewChild('ingList', { static: false }) ingList: PaymentListComponent;

  constructor(
    private fb: FormBuilder,
    private json: JsonService,
    private cmp: CmpService
  ) { }

  ngOnInit() {
  }

}