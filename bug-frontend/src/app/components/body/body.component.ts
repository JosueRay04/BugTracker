import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})

export class BodyComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  getBodyClass(): string {
    let styleClass = '';

    if (this.isLoginOrRequestPwdRoute()) {
      styleClass = 'body-full';
    } else if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen';
    }

    return styleClass;
  }

  private isLoginOrRequestPwdRoute(): boolean {
    // Asumiendo que estás utilizando Angular Router
    const currentRoute = window.location.pathname;

    return (
      currentRoute === '/login' ||
      currentRoute === '/requestPwd' ||
      currentRoute === '/restorePwd' ||
      currentRoute === '/sign' ||
      currentRoute === '/login/' ||
      currentRoute === '/requestPwd/' ||
      currentRoute === '/restorePwd/' ||
      currentRoute === '/sign/'
    );
  }
}

