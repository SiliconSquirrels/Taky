import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { DataManagerService } from './services/data-manager.service';
import { Device } from '@ionic-native/device/ngx';
import { RemoteServerManagerService } from './services/remote-server-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'home.title',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'profile.title',
      url: '/profile',
      icon: 'person-circle'
    },
    {
      title: 'agenda.title',
      url: '/agenda',
      icon: 'calendar'
    }
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public translate: TranslateService,
    private dataManager: DataManagerService,
    private menuCtrl: MenuController,
    private device: Device,
    private router: Router,
    private remoteServerManager: RemoteServerManagerService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.dataManager.setDeviceUUID(this.device.uuid);
      this.dataManager.setDeviceModel(this.device.model);

      // Set the default language for translation strings, and the current language.
      this.translate.setDefaultLang('it');

      // // back button => close menu
      // platform.registerBackButtonAction((event: any) => {
      //   if (this.menuCtrl.isOpen) {
      //     this.menuCtrl.close()
      //   } else
      //     if (event) {
      //       event.preventDefault();
      //     } else {
      //       console.log('back');
      //     }
      // });

      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  logout() {
    this.remoteServerManager.logout()
      .then(() => {
        this.router.navigate(['/login'], { replaceUrl: true });
        this.dataManager.clearUserData();
      })
      .catch(err => console.log(err));
  }

}
