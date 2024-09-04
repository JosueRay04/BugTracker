import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'
import { SignComponent } from './components/sign/sign.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RequestPwdComponent } from './components/request-pwd/request-pwd.component';
import { RestorePwdComponent } from './components/restore-pwd/restore-pwd.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { BugsComponent } from './components/bugs/bugs.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BugdetailComponent } from './components/bugdetail/bugdetail.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sign',
    component: SignComponent
  },
  {
    path: 'requestPwd',
    component: RequestPwdComponent
  },
  {
    path: 'restorePwd',
    component: RestorePwdComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'bugs',
    component: BugsComponent
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  },  
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'bugdetail/:bugName',  // Agrega un parámetro dinámico ':bugName'
    component: BugdetailComponent
  },
  {
    path: '**', redirectTo: 'login', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
