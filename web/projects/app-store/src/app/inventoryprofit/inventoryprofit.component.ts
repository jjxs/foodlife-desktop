import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JsonService, JsonResult, Util, PagingComponent, CmpService } from 'app-lib';
import { MatTableDataSource } from '@angular/material';
import { until } from 'protractor';
import { ActivatedRoute, Router } from '@angular/router';
//import excelExport from 'excel-export';

@Component({
  selector: 'app-inventoryprofit',
  templateUrl: './inventoryprofit.component.html',
  styleUrls: ['./inventoryprofit.component.css']
})
export class InventoryprofitComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['rownum','parts_type', 'part_name', 'parts_inventory_qty','parts_inventory_actual',  'remarks'];

  @ViewChild(PagingComponent, { static: false }) paging: PagingComponent;

  // 検索フォーム
  searchForm: FormGroup;

  types = [];
  editFlg = false;

  parts_inventory_actual_edit = [];
  remarks_edit = [];

  constructor(     
    private fb: FormBuilder,
    private json: JsonService,
    private route: ActivatedRoute,
    private cmp: CmpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({       
      actual_date: ['', Validators.required],
      inventory_user: ['', Validators.required],
      part_name: ['', []]
    });

    this.onCheckInfo();

  }

  // スクロールロード試験
  ngAfterViewInit(): void {
    this.onSearch();
  }

  onCheckInfo() {  
    this.json.post('s/s03p01/get_check_info/', {}).subscribe((response?: JsonResult) => {

      if (response.data) {
        let categories = response.data['categories'];

        
        this.types.push({"cat_name": "メニュー","id": -1});
        categories.forEach((group: any) => {
          group.checked = false;
          this.types.push(group);
        }); 
      }

    });
  }



  onSearch() { 
    this.editFlg = false;
    // let params = Util.appendIf(this.searchForm.value, this.paging.getParam());
    //let params = this.searchForm.value;
    //let params = this.getParam;
    let params = {};
    params['is_menu'] = 1;
    const type = [];
    this.types.forEach((element: any) => {
      if (element.checked) {
        if(element.id == -1){
          params['is_menu'] = 2;
        }else{
          type.push(element.id);
        }
      }
    });

    params['type'] = type
    params['part_name'] = this.searchForm.value.part_name

    this.dataSource.data = [];
    this.parts_inventory_actual_edit = [];
    this.remarks_edit = [];
    this.json.post('s/s03p01/get_inventorycontrol_data/', params).subscribe((response) => {

      if (response["data"]) {
        this.dataSource.data = response["data"];
        this.dataSource.data.forEach((element: any) => {
          this.parts_inventory_actual_edit.push(element.parts_inventory_actual);
          this.remarks_edit.push(element.remarks);
        });  
      }
    });
 
   
  }

  onSave() {
    if (this.searchForm.valid) {
      let params = {};
      params['actual_date'] = this.searchForm.value.actual_date.toLocaleDateString();
      params['inventory_user'] = this.searchForm.value.inventory_user;
      params['parts_inventory_actual_edit'] = this.parts_inventory_actual_edit;
      params['remarks_edit'] = this.remarks_edit;
      params['dataSource'] = this.dataSource.data;
      
      this.json.post('s/s03p01/save_inventory_actual/', params).subscribe((response) => { 
        if (response) {
          this.cmp.pop(response['message']);
          // this.checkflg = false;
          this.searchForm.reset();
          this.onSearch();
        }
      });
    }else{
      if (Util.isEmpty(this.searchForm.value.actual_date)){
        this.cmp.pop('棚卸日付は必要です！入力ください。');
      }else{
        this.cmp.pop('担当者は必要です！入力ください。');
      }
      
    }
  }

  checkType(event, row) {
    this.types.forEach((element: any) => {
      if ( element.id === row.id ) {
        element.checked = event.checked;
      }
    });
  }
  

  onDownLoad() {
    //let params = this.getParam;
    let params = {};
    const type = [];
    this.types.forEach((element: any) => {
      if (element.checked) {
        if(element.id == -1){
          params['is_menu'] = 2;
        }else{
          type.push(element.id);
        }
      }
    });

    params['type'] = type
    params['part_name'] = this.searchForm.value.part_name

    this.json.download('s/s03p01/export_inventorycontrol_data/', params).subscribe((response?: any[]) => {
      this.json.downLoadFile(response,'棚卸一覧');
    });
  }

  changeInventoryActual(value,rouNum) {
    this.parts_inventory_actual_edit[rouNum-1] = value;
  }

  changeRemarks(value,rouNum) {
    this.remarks_edit[rouNum-1] = value;
  }

}


