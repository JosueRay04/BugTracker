import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'bug-frontend';

  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(private router: Router) {}

  shouldShowSidenav(): boolean {
    const excludedPages = ['/login', '/sign', '/restorePwd', '/requestPwd']; // Agrega las rutas de las páginas que no deben mostrar el sidenav
    return !excludedPages.includes(this.router.url);  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
