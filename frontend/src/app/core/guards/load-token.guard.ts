import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AppState } from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import jwt_decode from 'jwt-decode';
import { IToken } from '../../types/itoken';
import { UserReducer } from '../../store/reducers/user.reducer';
import * as userActions from '../../store/actions/user.actions';

@Injectable({
    providedIn: 'root',
})
export class LoadTokenGuard implements CanActivate {
    constructor(private store: Store<AppState>) {}

    canActivate(): Observable<boolean> {
        const authorization = localStorage.Authorization;
        const exp = localStorage.Exp;
        if (!authorization || !exp) {
            localStorage.clear();
            this.store.dispatch(userActions.clearUser());
            return of(true);
        }
        return this.store.select('user').pipe(
            map((user) => {
                if (!user.email) {
                    const iToken = jwt_decode<IToken>(authorization);
                    const userReducer: UserReducer = {
                        id: iToken.id,
                        email: iToken.email,
                        exp: iToken.exp,
                        active: iToken.active,
                        admin: iToken.admin,
                        authorization: authorization,
                    };
                    this.store.dispatch(userActions.loadUser(userReducer));
                }
                return true;
            })
        );
    }
}