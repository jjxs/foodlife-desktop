import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { environment } from '../../environments/environment';
// import { AuthenticationService } from '../ami/authentication.service';


/** 
 *  
*/
@Injectable({
    providedIn: 'root'
})
export class ManagerService {

    // Toolbar 表示内容変更
    private changeToolbarSource = new Subject<string>();
    changeToolbar$ = this.changeToolbarSource.asObservable();

    private showPanelSource = new Subject<boolean>();
    showPanel$ = this.showPanelSource.asObservable();

    constructor(
        // private authSrv: AuthenticationService
    ) {
    }

    changeToolbar(content: string) {
        this.changeToolbarSource.next(content);
    }

    showPanel(shown: boolean) {
        this.showPanelSource.next(shown);
    }


}