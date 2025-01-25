import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { SelectionModel, SelectionChange } from '@angular/cdk/collections';
import { JsonService, Util, AuthenticationService } from 'ami';
import { SeatListData } from '../seat.interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'seat-map',
    templateUrl: './seat-map.component.html',
    styleUrls: ['./seat-map.component.css']
})
export class SeatMapComponent implements OnInit {

    seatList = [];

    @Output() selectSeat = new EventEmitter<any>();

    constructor(
        private authSrv: AuthenticationService,
        private router: Router,
        private jsonSrv: JsonService) {
            let condition = {
                seat_group: [],
                seat_type: [],
                seat_smoke_type: [],
                seat_number: [],
                seat_usable: '0'
              };
            this.jsonSrv.post('restaurant/seat_list/', condition ).subscribe((response?: any) => {
                if (!Util.isEmpty(response['data']) && response['data'][0]) {
                    this.seatList = response['data'];
                }
            });
        }

    ngOnInit() {
    }

    goTo(item) {
        this.selectSeat.emit( { value: item.id } );
    }
}

