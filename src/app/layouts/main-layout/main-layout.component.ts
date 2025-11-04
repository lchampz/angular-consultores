import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isHandset = false;
  currentUser: firebase.User | null = null;
  private subscriptions = new Subscription();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const breakpointSub = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches))
      .subscribe((matches) => {
        this.isHandset = matches;
      });
    this.subscriptions.add(breakpointSub);

    const userSub = this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
    this.subscriptions.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
