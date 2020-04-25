import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { RemoteServerManagerService } from '../services/remote-server-manager.service';
import { DataManagerService } from '../services/data-manager.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public username: string = '';
  public version: string = '';

  constructor(
    public translate: TranslateService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private appVersion: AppVersion,
    private remoteServerManager: RemoteServerManagerService,
    private dataManager: DataManagerService,
    private nativeStorage: NativeStorage,
  ) {

    // Set Remote Server Address (HARD-CODED FOR THIS APP!)
    this.appVersion.getVersionNumber()
      .then(value => this.version = 'v' + value)
      .catch(err => this.version = '');

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter LoginPage');
    this.menuCtrl.enable(false, 'appMenu');

    this.nativeStorage.getItem('username').then(
      data => this.username = data,
      error => console.error(error)
    );
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true, 'appMenu');
  }

  trimUsername() {
    this.username = this.username.trim()
  }

  async confirm() {
    if (this.username == '') {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('error'),
        subHeader: this.translate.instant('login.emailEmpty'),
        buttons: [this.translate.instant('ok')]
      });
      await alert.present();
    }
    else {
      this.remoteServerManager.forgotPassword(this.username)
        .then(async () => {
          const alert = await this.alertCtrl.create({
            header: this.translate.instant('operationComplete'),
            subHeader: this.translate.instant('login.forgotPasswordSuccess'),
            buttons: [this.translate.instant('ok')]
          });
          await alert.present();
        })
        .catch(async (err) => {
          const alert = await this.alertCtrl.create({
            header: this.translate.instant('error'),
            subHeader: this.translate.instant(err),
            buttons: [this.translate.instant('ok')]
          });
          await alert.present();
        })
    }
  }

  goToLogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  ngOnInit() {
  }

}
