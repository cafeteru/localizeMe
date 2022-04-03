import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
    formGroup = new FormGroup({});
    isLoading = false;

    constructor(
        private matDialogRef: MatDialogRef<LoginComponent>,
        private nzMessageService: NzMessageService,
        private userService: UserService,
        public matDialog: MatDialog
    ) {
        super();
    }

    override ngOnInit() {
        super.ngOnInit();
        this.formGroup = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required),
        });
    }

    createMessage(type: string, message: string): void {
        this.nzMessageService.create(type, message);
    }

    login(): void {
        this.isLoading = true;
        const subscription$ = this.userService
            .login({
                email: this.formGroup.controls['email'].value,
                password: this.formGroup.controls['password'].value,
            })
            .subscribe({
                next: (user) => {
                    this.isLoading = false;
                    this.close();
                    if (user.active) {
                        this.createMessage('success', 'Successfully logged.');
                    } else {
                        this.userService.logout();
                        this.createMessage('error', 'Session not started. User is not active.');
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.createMessage('error', 'Session not started. Check the fields.');
                },
            });
        this.subscriptions$.push(subscription$);
    }

    close(): void {
        this.matDialogRef.close();
    }

    openRegister(): void {
        this.close();
        this.matDialog.open(RegisterComponent, {
            minWidth: '550px',
            maxWidth: '75%',
        });
    }
}