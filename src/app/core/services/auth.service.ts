import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  signIn(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  getCurrentUser(): Observable<firebase.User | null> {
    try {
      return this.afAuth.authState;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return of(null);
    }
  }

  isAuthenticated(): Observable<boolean> {
    try {
      return this.afAuth.authState.pipe(
        map((user) => !!user),
        catchError((error) => {
          console.error('Erro ao verificar autenticação:', error);
          return of(false);
        })
      );
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return of(false);
    }
  }
}
