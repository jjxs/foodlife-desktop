import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthenticationService, AuthenticatedEvent } from 'ami';
import { environment } from 'projects/restaurant/src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  params = {
    username: '',
    password: ''
  }

  authenticated;
  constructor(
    private authSrv: AuthenticationService,
    private dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.authenticated = this.authSrv.Authenticated$.subscribe((event: AuthenticatedEvent) => {
      if (event.result === true) {
        this.dialogRef.close();
        this.authSrv.init();
      }
      this.authenticated.unsubscribe();
    });

  }

  ngOnInit() {
    console.log("this LoginComponent")
  }

  onNgDestory() {
    this.authenticated.unsubscribe();
  }

  login() {
    this.authSrv.authenticate(this.params);
  }

}
