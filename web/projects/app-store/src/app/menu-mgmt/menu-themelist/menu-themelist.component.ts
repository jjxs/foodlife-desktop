import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TableEmptyMessageComponent, JsonResult, CmpService, JsonService, AppSettings } from 'app-lib';
import { MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-menu-themelist',
  templateUrl: './menu-themelist.component.html',
  styleUrls: ['./menu-themelist.component.css']
})
export class MenuThemeListComponent implements OnInit {


  theme_list = AppSettings.getThemeList();
  
  constructor(
    private fb: FormBuilder,
    private cmp: CmpService,
    private json: JsonService
  ) { }

  ngOnInit() {
  }

}
