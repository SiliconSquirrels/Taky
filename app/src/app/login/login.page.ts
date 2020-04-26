import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform, AlertController, LoadingController, MenuController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { RemoteServerManagerService } from '../services/remote-server-manager.service';
import { DataManagerService } from '../services/data-manager.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public username: string = '';
  public password: string = '';
  public server: string = '127.0.0.1';
  public port: string = '9997';
  public displayAdvanced: boolean = false;
  public displayPassword: boolean = true;
  public version: string = '';

  constructor(
    public translate: TranslateService,
    private platform: Platform,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private appVersion: AppVersion,
    private remoteServerManager: RemoteServerManagerService,
    private dataManager: DataManagerService,
    private nativeStorage: NativeStorage) {

    // Set Remote Server Address (HARD-CODED FOR THIS APP!)
    this.remoteServerManager.setIpAddress(this.server)
    this.remoteServerManager.setPort(this.port);

    this.appVersion.getVersionNumber()
      .then(value => this.version = 'v' + value)
      .catch(err => this.version = '');

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter LoginPage');
    this.menuCtrl.enable(false, 'appMenu');

    this.nativeStorage.getItem('username').then(
      data => this.username = data,
      error => console.error(error)
    );

    // this.nativeStorage.getItem('server').then(
    //   data => this.server = data,
    //   error => console.error(error)
    // );
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true, 'appMenu');
  }

  trimUsername() {
    this.username = this.username.trim()
  }

  trimPassword() {
    this.password = this.password.trim()
  }

  trimServer() {
    this.server = this.server.trim()
  }

  loginChecks() {
    if (this.username == '')
      return "login.emailEmpty";
    else if (this.password == '')
      return "login.passwordEmpty";
    else if (this.server == '')
      return "login.serverEmpty";
    return '';
  }

  async doLogin() {
    var errMsg = this.loginChecks()

    if (errMsg != '') {
      this.presentAlertLoginError(errMsg);
      return;
    }

    // Save username/server in local storage
    this.nativeStorage.setItem('username', this.username)
      .then(() => console.log('username saved in native storage'))
      .catch(error => console.log(error));
    // this.nativeStorage.setItem('server', this.server)
    //   .then(() => console.log('server saved in native storage'))
    //   .catch(error => console.log(error));

    // // Set Remote Server Address (HARD-CODED FOR THIS APP!)
    // this.remoteServerManager.setIpAddress(this.server)
    // this.remoteServerManager.setPort(this.port);

    const spinner = await this.loadingCtrl.create({ message: this.translate.instant('login.wait') });

    spinner.present();
    // Do Login 
    this.remoteServerManager.login(this.username, this.password)
      .then(/*async*/() => {
        // Token already saved in RemoteServerManager

        // Save user data in App
        this.dataManager.setUsername(this.username);
        this.dataManager.setPassword(this.password);

        // this.dataManager.setLanguage(this.language);

        // this.nativeStorage.setItem('language', this.language)
        //   .then(() => console.log('language saved in native storage'))
        //   .catch(error => console.log(error));

        // Go to Homepage
        spinner.dismiss()
        this.router.navigate(['/home'], { replaceUrl: true });

      })
      .catch(async (err) => {
        console.log('[login] server error', err);

        //Login Failed
        spinner.dismiss()

        const alert = await this.alertCtrl.create({
          header: this.translate.instant('login.failed'),
          subHeader: this.translate.instant(err),
          buttons: [this.translate.instant('ok')]
        });
        await alert.present();

        return;
      })
  }

  toggleAdvanced() {
    this.displayAdvanced = !this.displayAdvanced;
  }

  toggleDisplayPassword() {
    this.displayPassword = !this.displayPassword;
  }

  bypassLogin() {
    this.router.navigate(['/home']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  async forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  async presentAlertLoginError(errMsg: string) {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('login.error'),
      subHeader: this.translate.instant(errMsg),
      buttons: [this.translate.instant('ok')]
    });
    await alert.present();
  }


  async doLoginDebug() {
    var errMsg = this.loginChecks()

    if (errMsg != '') {
      this.presentAlertLoginError(errMsg);
      return;
    }

    // Save username/server in local storage
    this.nativeStorage.setItem('username', this.username)
      .then(() => console.log('username saved in native storage'))
      .catch(error => console.log(error));

    const spinner = await this.loadingCtrl.create({ message: this.translate.instant('login.wait') });

    spinner.present();
    // Do Login 
    this.remoteServerManager.loginDebug(this.username, this.password)
      .then(/*async*/() => {
        // Token already saved in RemoteServerManager

        // Save user data in App
        this.dataManager.setUsername(this.username);
        this.dataManager.setPassword(this.password);

        // Go to Homepage
        spinner.dismiss()
        this.router.navigate(['/home'], { replaceUrl: true });

      })
      .catch(async (err) => {
        console.log('[login] server error', err);

        //Login Failed
        spinner.dismiss()

        const alert = await this.alertCtrl.create({
          header: this.translate.instant('login.failed'),
          subHeader: this.translate.instant(err),
          buttons: [this.translate.instant('ok')]
        });
        await alert.present();

        return;
      })
  }
}
